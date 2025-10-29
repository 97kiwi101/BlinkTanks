/*
InputTask.jsx
an input element with type textarea
+ a button with type submit
*/
import {useState} from 'react';

function InputTask({ placeholder }) {
    const [inputValue,setInputValue]=useState(['']); // The text in the input field

    return (
        <div>
            <input type="textarea" 
            placeholder={placeholder}
            onChange={(e) => setInputValue(e.target.value)} // When key is typed, add key to inputValue
            />
            <button type="submit">Submit</button>
        </div>
    );
}
export default InputTask;