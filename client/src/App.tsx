import TodoContainer from "./components/TodoContainer";
import { ToastProvider } from "./context/ToastContext";

const App = () => {
	return (
		<ToastProvider>
			<div className="flex bg-amber-900 min-h-screen">
				<TodoContainer />
			</div>
		</ToastProvider>
	)
}

export default App;
