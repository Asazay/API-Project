import './ConfirmDelete.css'
import {useDispatch} from 'react-redux';
import { deleteReviewThunk } from "../../store/review";
import { useModal } from "../../context/Modal";

const ConfirmDeleteModal = ({reviewId}) => {
    const dispatch = useDispatch();
    const {closeModal} = useModal();

    const handleDelete = async (e) => {
        e.preventDefault();
        await dispatch(deleteReviewThunk(reviewId))
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
            <div><p>Are you sure you want to delete this review?</p></div>
            <div id='choiceDiv'>
                <div id='choiceBtn'><button id="yesBtn" onClick={handleDelete}>{`Yes (Delete Review)`}</button></div>
                <div id='choiceBtn'><button id="noBtn" onClick={closeModal}>{`No (Keep Review)`}</button></div>
            </div>
        </div>
    )
}

export default ConfirmDeleteModal;