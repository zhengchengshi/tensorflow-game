import UiLayer from "./components/Uilayer";
import GestureConfig from './page/gestureConfig'
import Test from './components/algorithmCamera'
import {Route,Redirect,Switch} from 'react-router-dom'
import Start from "./page/start";
import Login from './page/login'
import Rankings from "./page/rankings";
import './APP.scss'
import Game from "./page/game";
function App() {
    return(
        <div>
            <Switch>
                <Route path='/login' component={Login}></Route>
                <Route path='/register' component={Login}></Route>
                <Route path="/start" component={Start}></Route>
                <Route path="/rankings" component={Rankings}></Route>
                <Route path="/gesture-config" component={GestureConfig}></Route>
                {/* <Route path="/game" component={UiLayer}></Route> */}
                <Route path="/Test" component={UiLayer}></Route>
                <Route path='/game' component={Game}></Route>
                <Redirect to="/start"></Redirect>
            </Switch>
            {/* <Tf></Tf> */}
            {/* <UiLayer></UiLayer> */}
        </div>
    )
}

export default App;
