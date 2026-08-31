import { useState } from 'react'
import {
  useCreateLeavePolicy,
  useDeleteLeavePolicy,
  useLeavePolicies,
  useUpdateLeavePolicy,
} from '../api/hooks/useLeavePolicies'
import { getErrorMessage } from '../api/errorMessage'
import type { LeavePolicy } from '../api/types'

type FormState = {
  code: string
  name: string
  annualQuota: string
  maxDaysPerRequest: string
  requiresDocumentationOverDays: string
}

const emptyForm: FormState = {
  code: '',
  name: '',
  annualQuota: '',
  maxDaysPerRequest: '',
  requiresDocumentationOverDays: '',
}

function toInt(value: string): number | null {
  if (value.trim() === '') return null
  const n = Number(value)
  return Number.isFinite(n) ? n : null
}

function LeavePolicies({ onApply }: { onApply: () => void }) {
  const { data: policies, isLoading, isError, error } = useLeavePolicies()
  const createPolicy = useCreateLeavePolicy()
  const updatePolicy = useUpdateLeavePolicy()
  const deletePolicy = useDeleteLeavePolicy()

  const [showForm, setShowForm] = useState(false)
  const [editingCode, setEditingCode] = useState<string | null>(null)
  const [form, setForm] = useState<FormState>(emptyForm)

  const startCreate = () => {
    setEditingCode(null)
    setForm(emptyForm)
    setShowForm(true)
  }

  const startEdit = (policy: LeavePolicy) => {
    setEditingCode(policy.id)
    setForm({
      code: policy.id,
      name: policy.name,
      annualQuota: policy.annualQuota?.toString() ?? '',
      maxDaysPerRequest: policy.maxDaysPerRequest?.toString() ?? '',
      requiresDocumentationOverDays:
        policy.requiresDocumentationOverDays?.toString() ?? '',
    })
    setShowForm(true)
  }

  const closeForm = () => {
    setShowForm(false)
    setEditingCode(null)
    setForm(emptyForm)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const payload = {
      name: form.name,
      annualQuota: toInt(form.annualQuota),
      maxDaysPerRequest: toInt(form.maxDaysPerRequest),
      requiresDocumentationOverDays: toInt(form.requiresDocumentationOverDays),
    }

    if (editingCode) {
      updatePolicy.mutate(
        { code: editingCode, input: payload },
        { onSuccess: closeForm },
      )
    } else {
      createPolicy.mutate(
        { code: form.code.toUpperCase(), ...payload },
        { onSuccess: closeForm },
      )
    }
  }

  const saving = createPolicy.isPending || updatePolicy.isPending
  const saveError = createPolicy.error ?? updatePolicy.error

  const activeCount = policies?.length ?? 0
  const quotas = (policies ?? [])
    .map((p) => p.annualQuota)
    .filter((q): q is number => typeof q === 'number')
  const avgQuota = quotas.length
    ? Math.round(quotas.reduce((a, b) => a + b, 0) / quotas.length)
    : null

  return (
    <>
      <header className="topbar">
        <div className="topbar-left">
          <h2 className="topbar-title">Leave Policies</h2>
          <div className="topbar-divider-v" />
          <span className="topbar-subtitle">Organization Configuration</span>
        </div>
        <div className="topbar-actions">
          <button className="icon-button" aria-label="Notifications">
            <span className="material-symbols-outlined">notifications</span>
          </button>
          <button className="btn-primary" onClick={onApply}>
            <span className="material-symbols-outlined">add</span>
            <span>Apply for Leave</span>
          </button>
        </div>
      </header>
      <main className="main">
        <div className="main-content">
          <section className="policy-page-header">
            <div className="page-heading">
              <h2 className="page-heading-title">Policy Management</h2>
              <p className="page-heading-subtitle">
                Define and manage time-off entitlements for your workforce.
                These rules will be automatically applied based on employee
                contracts and seniority.
              </p>
            </div>
            <button className="btn-primary btn-lg" onClick={startCreate}>
              <span className="material-symbols-outlined">add_circle</span>
              <span>Add New Leave Type</span>
            </button>
          </section>

          {isLoading && <p className="detail-label">Loading leave policies...</p>}
          {isError && (
            <p className="detail-error">
              {getErrorMessage(error)}
            </p>
          )}

          {showForm && (
            <section className="form-card">
              <div className="form-card-header">
                <h3>{editingCode ? 'Edit Leave Type' : 'Add New Leave Type'}</h3>
                <button className="icon-button" aria-label="Close" onClick={closeForm}>
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="form-row">
                  <div className="form-field">
                    <label className="form-label" htmlFor="lp-code">
                      Code
                    </label>
                    <input
                      id="lp-code"
                      className="form-input"
                      placeholder="e.g. WFH"
                      required
                      disabled={!!editingCode}
                      value={form.code}
                      onChange={(e) => setForm({ ...form, code: e.target.value })}
                    />
                  </div>
                  <div className="form-field">
                    <label className="form-label" htmlFor="lp-name">
                      Name
                    </label>
                    <input
                      id="lp-name"
                      className="form-input"
                      placeholder="e.g. Work From Home"
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-field">
                    <label className="form-label" htmlFor="lp-quota">
                      Annual Quota (days)
                    </label>
                    <input
                      id="lp-quota"
                      className="form-input"
                      type="number"
                      min={0}
                      value={form.annualQuota}
                      onChange={(e) =>
                        setForm({ ...form, annualQuota: e.target.value })
                      }
                    />
                  </div>
                  <div className="form-field">
                    <label className="form-label" htmlFor="lp-max">
                      Max Days Per Request
                    </label>
                    <input
                      id="lp-max"
                      className="form-input"
                      type="number"
                      min={1}
                      value={form.maxDaysPerRequest}
                      onChange={(e) =>
                        setForm({ ...form, maxDaysPerRequest: e.target.value })
                      }
                    />
                  </div>
                </div>
                <div className="form-field form-field-spaced">
                  <label className="form-label" htmlFor="lp-docs">
                    Requires Documentation Over (days)
                  </label>
                  <input
                    id="lp-docs"
                    className="form-input"
                    type="number"
                    min={0}
                    value={form.requiresDocumentationOverDays}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        requiresDocumentationOverDays: e.target.value,
                      })
                    }
                  />
                </div>

                {saveError && (
                  <p className="login-error">{getErrorMessage(saveError)}</p>
                )}

                <div className="form-actions">
                  <button type="button" className="btn-cancel" onClick={closeForm}>
                    Cancel
                  </button>
                  <button type="submit" className="btn-submit" disabled={saving}>
                    {saving ? 'Saving...' : editingCode ? 'Save Changes' : 'Create Policy'}
                  </button>
                </div>
              </form>
            </section>
          )}

          <section className="stats-grid policy-stats">
            <div className="stat-card">
              <p className="stat-label">Active Policies</p>
              <p className="stat-value stat-primary">{activeCount}</p>
            </div>
            <div className="stat-card">
              <p className="stat-label">Avg. Annual Quota</p>
              <p className="stat-value stat-primary">{avgQuota ?? '—'}</p>
            </div>
          </section>

          <section className="policy-cards">
            {(policies ?? []).map((policy) => (
              <div key={policy.id} className="glass-card policy-card-mini">
                <div className="policy-card-top">
                  <div className="policy-icon policy-teal">
                    <span className="material-symbols-outlined">event_note</span>
                  </div>
                  <div className="policy-card-actions">
                    <button
                      aria-label={`Edit ${policy.name}`}
                      onClick={() => startEdit(policy)}
                    >
                      <span className="material-symbols-outlined">edit</span>
                    </button>
                    <button
                      aria-label={`Delete ${policy.name}`}
                      onClick={() => deletePolicy.mutate(policy.id)}
                    >
                      <span className="material-symbols-outlined">delete</span>
                    </button>
                  </div>
                </div>
                <div className="policy-card-body">
                  <h4>{policy.name}</h4>
                  <p className="detail-mono">{policy.id}</p>
                </div>
                <div className="policy-card-details">
                  <div className="policy-detail-row">
                    <span>Annual Quota</span>
                    <span className="policy-detail-value">
                      {policy.annualQuota != null ? `${policy.annualQuota} Days` : '—'}
                    </span>
                  </div>
                  <div className="policy-detail-row">
                    <span>Max Per Request</span>
                    <span className="policy-detail-value">
                      {policy.maxDaysPerRequest != null
                        ? `${policy.maxDaysPerRequest} Days`
                        : '—'}
                    </span>
                  </div>
                  <div className="policy-detail-row">
                    <span>Documentation</span>
                    <span className="policy-detail-value">
                      {policy.requiresDocumentationOverDays != null
                        ? `Over ${policy.requiresDocumentationOverDays} Days`
                        : 'Not Required'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
            <button className="policy-add-card" onClick={startCreate}>
              <div className="policy-add-icon">
                <span className="material-symbols-outlined">add</span>
              </div>
              <span className="policy-add-title">New Policy Type</span>
              <p className="policy-add-hint">Click to define a custom leave</p>
            </button>
          </section>

          <section className="help-banner">
            <span className="material-symbols-outlined">help_outline</span>
            <div className="help-text">
              <p className="help-title">
                Need help with complex accrual rules?
              </p>
              <p className="help-desc">
                Our documentation explains how to set up prorated leave for
                part-time employees or tenure-based increases.
              </p>
            </div>
            <button className="help-btn">View Documentation</button>
          </section>
        </div>
      </main>
    </>
  )
}

export default LeavePolicies
