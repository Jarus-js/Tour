import React, { useState, Fragment, useContext } from "react";
import axios from "axios";
import Card from "../../shared/components/UIElements/Card";
import Button from "../../shared/components/FormElements/Button";
import Modal from "../../shared/components/UIElements/Modal";
import sendHttpRequest from "../../shared/components/utils/httpRequest";
import { AuthContext } from "../../shared/components/context/auth-Context";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import "./PlactItem.css";
const PlactItem = props => {
  const auth = useContext(AuthContext);
  const [error, setError] = useState();
  const [showMap, setShowMap] = useState(false);

  const openMapHandler = () => {
    setShowMap(true);
  };
  const closeMapHandler = () => {
    setShowMap(false);
  };

  const deleteHandler = e => {
    e.preventDefault();
    axios
      .delete(`${process.env.REACT_APP_BACKEND_URL}/place/${props.id}`, {
        headers: {
          Authorization: "Bearer " + auth.token
        }
      })
      .then(response => {
        console.log("deleteResponse", response);
        props.onDelete(props.id);
      })
      .catch(err => setError(err.response.data.message));
  };
  const errorHandler = () => {
    setError(null);
  };
  return (
    <Fragment>
      <ErrorModal error={error} onClear={errorHandler} />
      <Modal
        show={showMap}
        onCancel={closeMapHandler}
        header={props.address}
        contentClass="place-item__modal-content"
        footerClass="place-item__modal-actions"
        footer={<Button onClick={closeMapHandler}>CLOSE</Button>}
      >
        <div className="map-container">{props.description}</div>
      </Modal>
      <li className="place-item">
        <Card className="place-item__content">
          <div className="plact-item__image">
            <img
              src={`${process.env.REACT_APP_BACKEND_ASSEST_URL}/${props.image}`}
              alt={props.title}
            />
          </div>
          <div className="place-item__info">
            <h2>{props.title}</h2>
            <h3>{props.address}</h3>
          </div>
          <div className="place-item__actions">
            <Button inverse onClick={openMapHandler}>
              MORE
            </Button>
            {auth.userId === props.creatorId && (
              <Button to={`/places/${props.id}`}>EDIT</Button>
            )}
            {auth.userId === props.creatorId && (
              <Button danger onClick={deleteHandler}>
                DELETE
              </Button>
            )}
          </div>
        </Card>
      </li>
    </Fragment>
  );
};

export default PlactItem;
