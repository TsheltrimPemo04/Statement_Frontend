import Header from "./components/Header";
import Chatbot from "./pages/Chatbot";

export default function App() {
  return (
    <div className="h-screen w-screen flex flex-col">
      <Header />
      <Chatbot/>
    </div>
  );
}
