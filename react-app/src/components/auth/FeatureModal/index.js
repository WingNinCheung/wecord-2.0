import React, { useState } from "react";
import { Modal } from "../../modal/modal";
import FeatureList from "../../HomePage/featureList";

function FeatureModel({ setShowFeature }) {
  const [showModal, setShowModal] = useState(true);

  return (
    <>
      <Modal onClose={() => setShowModal(false)}>
        <FeatureList setShowFeature={setShowFeature} />
      </Modal>
    </>
  );
}

export default FeatureModel;
