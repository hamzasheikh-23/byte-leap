import React from "react";

export interface Milestone {
  criteria: string;
  amount: string;
  due: string;
}

interface MilestoneManagerProps {
  milestones: Milestone[];
  onUpdate: (index: number, field: keyof Milestone, value: string) => void;
  onAdd: () => void;
  onRemove: (index: number) => void;
}

export default function MilestoneManager({
  milestones,
  onUpdate,
  onAdd,
  onRemove,
}: MilestoneManagerProps) {
  return (
    <div style={{ position: "relative" }}>
      <table className="financial-table">
        <thead>
          <tr>
            <th className="text-left" style={{ width: "60%" }}>
              Deliverable / Acceptance Criteria
            </th>
            <th style={{ width: "20%" }}>Payment Amount (PKR)</th>
            <th style={{ width: "20%" }}>Due Within</th>
          </tr>
        </thead>
        <tbody>
          {milestones.map((m, idx) => (
            <tr key={idx} className="milestone-row-hover">
              <td className="text-left" style={{ position: "relative", padding: "12px 15px" }}>
                <div
                  className="editable-field"
                  contentEditable="true"
                  suppressContentEditableWarning={true}
                  onBlur={(e) => onUpdate(idx, "criteria", e.currentTarget.textContent || "")}
                  style={{
                    outline: "none",
                    minHeight: "24px",
                    paddingRight: "30px",
                    width: "100%",
                    boxSizing: "border-box",
                  }}
                >
                  {m.criteria}
                </div>
                {milestones.length > 1 && (
                  <button
                    className="delete-milestone-btn no-print"
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemove(idx);
                    }}
                    title="Delete this milestone"
                  >
                    &times;
                  </button>
                )}
              </td>
              <td style={{ padding: "12px 15px" }}>
                <div
                  className="editable-field"
                  contentEditable="true"
                  suppressContentEditableWarning={true}
                  onBlur={(e) => onUpdate(idx, "amount", e.currentTarget.textContent || "")}
                  style={{ outline: "none", fontWeight: 700, width: "100%", boxSizing: "border-box" }}
                >
                  {m.amount}
                </div>
              </td>
              <td style={{ padding: "12px 15px" }}>
                <div
                  className="editable-field"
                  contentEditable="true"
                  suppressContentEditableWarning={true}
                  onBlur={(e) => onUpdate(idx, "due", e.currentTarget.textContent || "")}
                  style={{ outline: "none", width: "100%", boxSizing: "border-box" }}
                >
                  {m.due}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div style={{ marginTop: "-15px", marginBottom: "25px", textAlign: "right" }} className="no-print">
        <button
          onClick={onAdd}
          className="esign-btn"
          style={{
            background: "rgba(75, 44, 145, 0.06)",
            color: "var(--primary)",
            border: "1px dashed var(--primary)",
            boxShadow: "none",
            display: "inline-flex",
          }}
        >
          <i className="fas fa-plus"></i> Add Milestone Row
        </button>
      </div>
    </div>
  );
}
