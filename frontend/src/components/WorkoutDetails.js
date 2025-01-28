import { useWorkoutsContext } from "../hooks/useWorkoutsContext";
import { useState } from "react";
import { useAuthContext } from "../hooks/useAuthContext";

// date fns
import formatDistanceToNow from 'date-fns/formatDistanceToNow';

const WorkoutDetails = ({ workout }) => {

    const { dispatch } = useWorkoutsContext();
    const { user } = useAuthContext();

    const [isEditing, setIsEditing] = useState(false);
    const [editedWorkout, setEditedWorkout] = useState({
        title: workout.title,
        load: workout.load,
        reps: workout.reps
    });

    const handleClick = async () => {
        if (!user) {
            return
        }

        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/workouts/${workout._id}`, {
            method: 'DELETE',
            headers: {
                "Authorization": `Bearer ${user.token}`
            }
        });

        const json = await response.json();

        if (response.ok) {
            dispatch({type: 'DELETE_WORKOUT', payload: json});
        }
    }
    
    const handleEditClick = () => {
        setIsEditing(true);
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditedWorkout({
            ...editedWorkout,
            [name]: value
        });
    }

    const handleSubmit = async () => {

        if (!user) {
            return
        }
        
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/workouts/${workout._id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                "Authorization": `Bearer ${user.token}`
            },
            body: JSON.stringify(editedWorkout)
        });

        const json = await response.json();

        if (response.ok) {
            dispatch({type: 'UPDATE_WORKOUT', payload: json});
            setIsEditing(false);
        }
    }

    return (
        // <div className="workout-details">
        //     <h4>{workout.title}</h4>
        //     <p><strong>Load (kg): </strong>{workout.load}</p>
        //     <p><strong>Reps: </strong>{workout.reps}</p>
        //     <p>{formatDistanceToNow(new Date(workout.createdAt), { addSuffix: true})}</p>
            
        //     <span className="material-symbols-outlined edit-icon">edit</span>
        //     <span className="material-symbols-outlined delete-icon" onClick={handleClick}>delete</span>
        // </div>

        <div className="workout-details">
            {isEditing ? (
                <div>
                    <input
                        type="text"
                        name="title"
                        value={editedWorkout.title}
                        onChange={handleChange}
                    />
                    <input
                        type="number"
                        name="load"
                        value={editedWorkout.load}
                        onChange={handleChange}
                    />
                    <input
                        type="number"
                        name="reps"
                        value={editedWorkout.reps}
                        onChange={handleChange}
                    />
                    <button className="btn" onClick={handleSubmit}>Save</button>
                    <button className="btn cancel" onClick={() => setIsEditing(false)}>Cancel</button>
                </div>
            ) : (
                <>
                    <h4>{workout.title}</h4>
                    <p><strong>Load (kg): </strong>{workout.load}</p>
                    <p><strong>Reps: </strong>{workout.reps}</p>
                    <p>{formatDistanceToNow(new Date(workout.createdAt), { addSuffix: true })}</p>

                    <span className="material-symbols-outlined edit-icon" onClick={handleEditClick}>edit</span>
                    <span className="material-symbols-outlined delete-icon" onClick={handleClick}>delete</span>
                </>
            )}
        </div>
    )
}

export default WorkoutDetails;