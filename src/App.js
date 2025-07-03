import './App.css';
import BestRest from './components/BestRest';
import Footer from './components/Footer';
import Navigate from './components/Navigate';
import OffersBanner from './components/OfferBanner';
import RestaurentChain from './components/RestaurentChain';
import RestaurentOnline from './components/RestaurentOnline';

function App() {
  return (
    <div>
      <Navigate/>
      <OffersBanner/>
      <RestaurentChain/>
      <RestaurentOnline/>
      <BestRest/>
      <Footer/>
    </div>
  );
}

export default App;
