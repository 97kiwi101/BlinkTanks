/*
Task.jsx
a component that returns an input element of type 'checkbox'
+ span element with task text
*/

function Task({ text, completed, onToggle }) {

    return(
        <div>
            <input 
            type="checkbox"
            checked={completed}
            onChange={onToggle}/>
            <span style = {{textDecoration: completed ? 'line-through' : 'none'}}>{text}</span>
        </div>
    );
}

export default Task;
