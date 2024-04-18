import {useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';
// import {useNavigate} from 'react-router-dom';
import { selectAllSpots } from '../../store/spot';
import SpotPageItem from './SpotPageItem';
import { loadSpotsThunk } from '../../store/spot';

import './HomePage.css';

const HomePage = () => {
    let spots = useSelector(selectAllSpots);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(loadSpotsThunk()).catch(async (res) => {
            const data = res.json();
            if(data && data.errors) console.log(data.errors)
        })
    }, [dispatch]);
    
    return (
        <div id='spotContent'>
        {
         spots && 
         <>
         {spots?.map(spot => {
            return (
                <SpotPageItem key={spot.id} spot={spot}/>
            )
         })}
         </>
        }
        </div>
    )
}

export default HomePage;