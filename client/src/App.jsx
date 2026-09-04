import './App.css'
import { Route, Routes } from "react-router-dom";

import Footer from "./components/layout/Footer";
import Navbar from "./components/layout/Navbar";
import ProtectedRoute from "./components/layout/ProtectedRoute";

import Home from "./pages/Home";
import BrowseWines from "./pages/BrowseWines";
import WineDetails from "./pages/WineDetails";
import Login from "./pages/Login";
import Register from "./pages/Register";
import MyCellar from "./pages/MyCellar";
import AddCellarEntry from "./pages/AddCellarEntry";
import CellarEntryDetails from "./pages/CellarEntryDetails";
import EditCellarEntry from "./pages/EditCellarEntry";
import NotFound from "./pages/NotFound";
import AddTastingNote from "./pages/AddTastingNote";
import TastingNoteDetails from "./pages/TastingNoteDetails";
import EditTastingNote from "./pages/EditTastingNote";
import MyTastingNotes from "./pages/MyTastingNotes";
import Dashboard from "./pages/Dashboard";


function App() {
  return (
    <>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/browse" element={<BrowseWines />} />
        <Route path="/wines/:id" element={<WineDetails />} />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/cellar"
          element={
            <ProtectedRoute>
              <MyCellar />
            </ProtectedRoute>
          }
        />

        <Route
          path="/cellar/add"
          element={
            <ProtectedRoute>
              <AddCellarEntry />
            </ProtectedRoute>
          }
        />

        <Route
          path="/cellar/:id"
          element={
            <ProtectedRoute>
              <CellarEntryDetails />
            </ProtectedRoute>
          }
        />

        <Route
          path="/cellar/:id/edit"
          element={
            <ProtectedRoute>
              <EditCellarEntry />
            </ProtectedRoute>
          }
        />

        <Route
          path="/tasting-notes/add"
          element={
            <ProtectedRoute>
              <AddTastingNote />
            </ProtectedRoute>
          }
        />

        <Route
          path="/tasting-notes/:id"
          element={
            <ProtectedRoute>
              <TastingNoteDetails />
            </ProtectedRoute>
          }
        />

        <Route
          path="/tasting-notes/:id/edit"
          element={
            <ProtectedRoute>
              <EditTastingNote />
            </ProtectedRoute>
          }
        />


        <Route
          path="/tasting-notes"
          element={
            <ProtectedRoute>
              <MyTastingNotes />
            </ProtectedRoute>
          }
        />


        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<NotFound />} />
      </Routes>

      <Footer />
    </>
  );
}

export default App;