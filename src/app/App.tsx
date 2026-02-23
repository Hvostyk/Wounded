import { NavLink } from "react-router";
import "./reset.scss";
export const App = () => {
    return (
        <div>
            <NavLink to="test1">
                <button>
                    <span>test 1</span>
                </button>
            </NavLink>

            <NavLink to="test2">
                <button>
                    <span>test 2</span>
                </button>
            </NavLink>
        </div>
    );
};
