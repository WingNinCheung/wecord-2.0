import "./HomePage.css";
export default function FeatureList({ setShowModal, setShowFeature }) {
  const handleDone = (e) => {
    e.preventDefault();
    setShowFeature(false);
  };
  return (
    <div className="feature-list">
      <h2 className="feat-title">What's New in Wecord 2.0!</h2>
      <div className="feat-para">
        <div>Messaging with full CRUD in real-time</div>
        <ul>
          <li>users can create, read, update and delete their messages now</li>
        </ul>
        <div>Automatic scroll down to the bottom in chat</div>
        <ul>
          <li>
            chat feed automatically scrolls to bottom when new messages arrives
          </li>
        </ul>
        <div>Press enter key to send messages</div>
        <ul>
          <li>user can press "Enter" on the keyboard to send messages now</li>
        </ul>
      </div>
      <button className="got-btn" onClick={handleDone}>
        Got it!
      </button>
      <span className="copyright">Ricky Cheung@Jan 2023</span>
    </div>
  );
}
