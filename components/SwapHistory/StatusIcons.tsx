import { SwapStatus } from "../../models/SwapStatus";

export default function StatusIcon({ swap }: { swap: string | undefined }) {
  switch (swap) {
    case SwapStatus.Failed:
      return (
        <>
          <div className="inline-flex items-center">
            <p>Failed</p>
          </div>
        </>)
    case SwapStatus.Completed:
      return (
        <>
          <div className="inline-flex items-center">
            <p>Completed</p>
          </div>
        </>
      )
    case SwapStatus.Cancelled:
      return (
        <>
          <div className="inline-flex items-center">
            <p>Cancelled</p>
          </div>
        </>)
    case SwapStatus.UserTransferPending:
      return (
        <>
          <div className="inline-flex items-center">
            <p>Deposite pending</p>
          </div>
        </>)
    case SwapStatus.UserTransferDelayed:
      return (
        <>
          <div className="inline-flex items-center">
            <p>Delayed</p>
          </div>
        </>)
    case SwapStatus.LsTransferPending:
      return (
        <>
          <div className="inline-flex items-center">
            <p>Pending</p>
          </div>
        </>)
    case SwapStatus.Expired:
      return (
        <>
          <div className="inline-flex items-center">
            <p>Expired</p>
          </div>
        </>)
  }
}