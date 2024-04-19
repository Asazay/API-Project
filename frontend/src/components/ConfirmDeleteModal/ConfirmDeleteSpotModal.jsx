import './ConfirmDelete.css'
import {useDispatch} from 'react-redux';
import { deleteSpotThunk } from "../../store/spot";
import { useModal } from "../../context/Modal";

const ConfirmDeleteSpotModal = ({spotId}) => {
    const dispatch = useDispatch();
    const {closeModal} = useModal();

    const handleDelete = async (e) => {
        e.preventDefault();
        await dispatch(deleteSpotThunk(Number(spotId)))
          .then(() => {closeModal();})
          .catch(async (res) => {
            const data = await res.json();
            if (data && data.message) {
              console.log(data.message);
            }
          });
      };

    return (
        <div id='confirmDeleteForm'>
            <div><h1>Confirm Delete</h1></div>
            <div><p>Are you sure you want to remove this spot?</p></div>
            <div id='choiceDiv'>
                <div id='choiceBtn'><button id="yesBtn" onClick={handleDelete}>{`Yes (Delete Spot)`}</button></div>
                <div id='choiceBtn'><button id="noBtn" onClick={closeModal}>{`No (Keep Spot)`}</button></div>
            </div>
        </div>
    )
}

export default ConfirmDeleteSpotModal;