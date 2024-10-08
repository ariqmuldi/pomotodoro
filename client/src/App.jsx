import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import Timer from './components/Timer';
import Settings from './components/Settings';
import SettingsContext from './context/SettingsContext';
import Input from './components/Input';
import InputItems from './components/InputItems';
import Header from './components/Header';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import UserForm from './components/UserForm';
import { AuthProvider } from './context/AuthContext';
import CreateNote from './components/CreateNote';
import Note from './components/Note';
import { AuthContext } from './context/AuthContext';

function App() {
  const [showSettings, setShowSettings] = useState(false);
  const [workMinutes, setWorkMinutes] = useState(25);
  const [breakMinutes, setBreakMinutes] = useState(5);
  const [longBreakMinutes, setLongBreakMinutes] = useState(15);

  const [allInputs, setAllInputs] = useState([]);
  const [listNotes, setListNotes] = useState([]);

  const { user, register, login, logout } = useContext(AuthContext);

  const removeItem = (index) => {
    const newInputs = allInputs.filter((_, i) => i !== index); // Filter out the clicked item
    setAllInputs(newInputs); // Update the state
  };

  function addNote(note) {
    setListNotes((prev) => { return [
      ...prev, note
    ];

    });

  };
  
  function delNote(id) {
    if (user) {
      // If user is logged in, delete by the note's database ID
      setListNotes((prev) => prev.filter(note => note.id !== id));
    } else {
      // If user is not logged in, delete by the index
      setListNotes((prev) => prev.filter((note, index) => index !== id));
    }
  }

  const getNotes = async () => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_ADDRESS}get-notes`, { userId : user.id },
        { headers: { 'Content-Type': 'application/json' } } );
        if (response.data.success) {
          console.log(response.data.notes)
          setListNotes(response.data.notes);
      } else {
        console.log("No notes found or unauthorized.");
      }
    } catch (err) {
      console.error("Error fetching notes:", err);
    }
  };

  useEffect(() => {
    if (user) {
      getNotes(); // Call this when the user is logged in
    } else {
      setListNotes([]); // Clear notes when user logs out
    }
  }, [user]);

  // useEffect(() => {
  //   if (user) {
  //     setListNotes([]); // Clear all notes upon login
  //   }
  //   else { }
  // }, [user]); 

  useEffect(() => {
    console.log(listNotes);
  }, [listNotes])

  // const fetchApi = async () => {
  //   const response = await axios.get(import.meta.env.VITE_BACKEND_ADDRESS + "api"); 
  //   // const response = await axios.get(`${import.meta.env.VITE_BACKEND_ADDRESS}api`);
  //   console.log(response.data.fruits);
  // };

  // useEffect(() => {
  //   fetchApi();
  // }, [])

  return (
    

    <Router>
      <Routes>
        <Route exact path = "/" element = {
          <>
            <div className="main-container d-flex flex-column justify-content-center">
              <SettingsContext.Provider value ={ { workMinutes, breakMinutes, longBreakMinutes, 
              setWorkMinutes, setBreakMinutes, setLongBreakMinutes, showSettings, setShowSettings } } >

                <div className="header-container">
                  <Header onForm={false} onLogout={() => setListNotes([])} />
                </div>

                <div className="timer-settings-container d-flex flex-column align-items-center w-100">
                  {showSettings ? <Settings /> : <Timer /> }
                </div>


                {!showSettings && (
                <>
                  <div className="input-container">
                    <Input allInputs={allInputs} setAllInputs={setAllInputs} />
                  </div>

                  <InputItems allInputs={allInputs} removeItem={removeItem} />
                </>
                )}

                <hr 
                className="d-flex align-items-center text-center justify-content-center" 
                style={{ margin: '0 auto', padding: 0, width: '30%', color: '#6D6A75' }} 
                />

                <CreateNote onAdd={addNote} />

                <div className="container-fluid mb-3">
                  <div className="row justify-content-center g-4">
                  {listNotes.map((note, index) => {
                    const noteId = user ? note.id : index;
                    return (
                      <div className="col-12 col-sm-6 col-md-4 d-flex justify-content-center" key={index}>
                        <Note title={note.title || note.note_title} content={note.content || note.note_content} id={noteId} onDel={delNote} />
                      </div>
                    );
                  })}
                  </div>
                </div>
                  



              </SettingsContext.Provider>
      
            </div>
          </>
        } >
        </Route>

        <Route exact path = "/register" element = {
          <>
            <div className="main-container d-flex flex-column justify-content-center">
              <SettingsContext.Provider value ={ { workMinutes, breakMinutes, longBreakMinutes, 
              setWorkMinutes, setBreakMinutes, setLongBreakMinutes, showSettings, setShowSettings } } >

                <div className="header-container">
                  <Header onForm={true} />
                </div>

                <div className="userForm-container">
                  <UserForm formType={'register'} />
                </div>

              </SettingsContext.Provider>

            </div>

          </>
        } >
        </Route>

        <Route exact path = "/login" element = {
          <>
            <div className="main-container d-flex flex-column justify-content-center">
              <SettingsContext.Provider value ={ { workMinutes, breakMinutes, longBreakMinutes, 
              setWorkMinutes, setBreakMinutes, setLongBreakMinutes, showSettings, setShowSettings } } >

                <div className="header-container">
                  <Header onForm={true} />
                </div>

                <div className="userForm-container">
                  <UserForm formType={'login'} />
                </div>

              </SettingsContext.Provider>

            </div>

          </>
        } >
        </Route>
      </Routes>
    </Router>

    
    
    
  );
}

export default App;
