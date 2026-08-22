## Feedback Semantics

Feedback tells the user what happened without making them reconstruct the system's state from visual noise. The right
feedback surface depends on whether the user must change something, whether the current task remains open, and whether
the message needs to stay attached to a particular control.

The core rule is:

```text
If the user must fix something here, show it here.
If the system is reporting something that does not require a local correction, use a toast.
```

This is a semantic decision, not a preference for one component. A Toast, an inline message, a field message, and a
dialog message all answer different questions.

### Toast

Use a Toast for temporary, global feedback about an operation whose result does not require the user to edit the current
interface.

Good Toast cases include:

- a network or server failure when there is nothing meaningful to correct in the current form;
- a background operation that finished or failed while the user can continue working;
- a successful action after its Dialog has closed;
- a non-blocking status update that should be noticed but should not rearrange the current page.

A Toast may be emitted while a Dialog remains open. The Dialog can stay open when the user may retry the operation and
there is no local input to correct. This is the right pattern for a selection Dialog where the user only chooses items
or quantities and a submission fails because of a server or network problem.

### Inline and local feedback

Use feedback inside the current surface when the message explains what the user must change or where the problem lives.

Use a field-level message when one field is invalid. Use an inline form message when the form has a correctable problem
that is not owned by one field. Use a Dialog-level message when the Dialog's current task is blocked until the user
changes something there.

Examples:

- an invalid email address belongs beside the email field;
- a missing required choice belongs in the form or beside the relevant control;
- a conflict caused by the selected options belongs in the Dialog if the user must change those options;
- a server outage after an otherwise valid submission may use a Toast while keeping the Dialog open for retry.

Do not use a Toast as the only explanation for a correctable local error. It disappears, is spatially separated from the
control, and makes recovery harder.

### Success after a Dialog

When a Dialog represents a complete operation, close it after a successful result and show the success Toast in the
underlying interface. The Toast then confirms the completed operation in the context where the user continues working.

Do not leave a completed Dialog open only because its success message was implemented as a Toast. The Dialog is the work
surface; once the work is complete, its temporary context should end.

### Toasts with actions

Use an action Toast when the user has a meaningful, time-sensitive response such as Undo, Retry, or Restore. The action
must be optional recovery or reversal, not the only way to understand a correctable form error.

An action Toast must remain visible, readable, keyboard accessible, and clickable above any surface that is currently
open. A Toast shown while a Dialog is open belongs above the Dialog backdrop and must not be hidden by its blur layer.

Nodzimo's current Toast viewport uses `z-60` for this reason. The value is an implementation detail of the current layer
contract; the durable rule is that Toast feedback remains above modal backdrop treatment.

### Decision questions

Before choosing a feedback surface, ask:

1. Must the user change something in the current surface?
2. Is the message attached to one field, a form, a Dialog, or the application as a whole?
3. Does the current task remain open for retry, or is it complete?
4. Does the message need an action such as Undo or Retry?
5. Will the message remain readable and reachable above the current overlay layers?

The practical summary is:

```text
Correctable here -> local feedback.
Not correctable here -> Toast.
Successful Dialog operation -> close Dialog, then Toast.
Important recovery action -> action Toast, above the active overlay.
```
