import '../styles/loader.css'

export default function Loader() {
  return (
    <div className="loader-container">
      <div className="loader">
        <div className="loader-spinner"></div>
        <p className="loader-text">Loading...</p>
      </div>
    </div>
  )
}
