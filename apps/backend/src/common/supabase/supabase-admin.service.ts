import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import type { Role } from '../decorators/roles.decorator';

@Injectable()
export class SupabaseAdminService {
  private readonly client: SupabaseClient;

  constructor(config: ConfigService) {
    const url = config.get<string>('SUPABASE_URL');
    const serviceRoleKey = config.get<string>('SUPABASE_SERVICE_ROLE_KEY');

    this.client = createClient(url ?? '', serviceRoleKey ?? '', {
      auth: { autoRefreshToken: false, persistSession: false },
    });
  }

  async listUserRoles(): Promise<Map<string, Role>> {
    const roleByUserId = new Map<string, Role>();
    let page = 1;
    const perPage = 1000;

    for (;;) {
      const { data, error } = await this.client.auth.admin.listUsers({
        page,
        perPage,
      });

      if (error) {
        throw error;
      }

      for (const user of data.users) {
        const role =
          (user.app_metadata?.role as Role | undefined) ??
          (user.user_metadata?.role as Role | undefined) ??
          'employee';
        roleByUserId.set(user.id, role);
      }

      if (data.users.length < perPage) break;
      page += 1;
    }

    return roleByUserId;
  }

  async updateUserRole(userId: string, role: Role): Promise<void> {
    const { error } = await this.client.auth.admin.updateUserById(userId, {
      app_metadata: { role },
    });

    if (error) {
      throw error;
    }
  }
}
