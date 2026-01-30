import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { PlusCircle, Play, ArrowRight, Save, LogOut, Lock } from 'lucide-react';
import { PRESET_CATEGORIES } from '../data/initialData';

export const LoginScreen: React.FC = () => {
  const { gameState, register, login, logout, createGroup, joinGroup, createCategory, addQuestion, startGame, addPlayer } = useGame();
  
  // --- LOCAL STATE ---
  // Auth
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);

  // Room Auth
  const [roomName, setRoomName] = useState('');
  const [roomPass, setRoomPass] = useState('');
  const [isCreatingRoom, setIsCreatingRoom] = useState(false);

  // Dashboard Navigation
  const [view, setView] = useState<'dashboard' | 'editor' | 'setup'>('dashboard');

  // Editor
  const [newCatTitle, setNewCatTitle] = useState('');
  const [qForm, setQForm] = useState({ catId: '', q: '', a: '', points: 100 });

  // Setup
  const [selectedCats, setSelectedCats] = useState<string[]>([]);
  const [newPlayerName, setNewPlayerName] = useState('');


  // --- HANDLERS ---
  const handleAuth = async () => {
      if (!username || !password) return alert("Enter credentials");
      
      if (isRegistering) {
          const success = await register(username, password);
          if (success) {
              alert("Registered! Please login.");
              setIsRegistering(false);
          } else {
              alert("Username taken.");
          }
      } else {
          const success = await login(username, password);
          if (!success) alert("Invalid credentials");
      }
  };

  const handleRoomAuth = async () => {
      if (!roomName || !roomPass) return alert("Enter room details");

      if (isCreatingRoom) {
          const success = await createGroup(roomName, roomPass);
          if (!success) alert("Room name exists");
      } else {
          const success = await joinGroup(roomName, roomPass);
          if (!success) alert("Room not found or wrong password");
      }
  };

  const handleAddCategory = () => {
      if (!newCatTitle) return;
      createCategory(newCatTitle);
      setNewCatTitle('');
  };

  const handleAddQuestion = () => {
      if (!qForm.catId || !qForm.q || !qForm.a) return alert("Fill all fields");
      addQuestion(qForm.catId, qForm.q, qForm.a, qForm.points);
      setQForm({ ...qForm, q: '', a: '' });
      alert("Saved to Database!");
  };
  
  const toggleCatSelection = (id: string) => {
      setSelectedCats(prev => 
          prev.includes(id) ? prev.filter(x => x !== id) : (prev.length < 20 ? [...prev, id] : prev)
      );
  };


  // --- VIEWS ---

  // 1. AUTHENTICATION (Login / Register)
  if (gameState.status === 'auth') {
    return (
      <div className="min-h-screen bg-jeopardy-blue flex items-center justify-center p-4">
        <div className="bg-jeopardy-dark border-4 border-jeopardy-yellow p-8 rounded-xl max-w-md w-full shadow-2xl relative">
           <h1 className="text-5xl font-black text-white mb-2 text-center jeopardy-text drop-shadow-md">JEOPARDY!</h1>
           <h2 className="text-xl font-bold text-jeopardy-yellow mb-8 text-center uppercase tracking-widest">
               {isRegistering ? "Register New User" : "User Login"}
           </h2>
           
           <div className="space-y-4">
             <input 
               className="w-full p-4 bg-blue-950 border-2 border-blue-700 rounded text-white placeholder-blue-400 outline-none focus:border-jeopardy-yellow font-bold text-lg"
               placeholder="USERNAME"
               value={username}
               onChange={e => setUsername(e.target.value)}
             />
             <input 
               className="w-full p-4 bg-blue-950 border-2 border-blue-700 rounded text-white placeholder-blue-400 outline-none focus:border-jeopardy-yellow font-bold text-lg"
               type="password"
               placeholder="PASSWORD"
               value={password}
               onChange={e => setPassword(e.target.value)}
             />
             
             <button 
               onClick={handleAuth}
               className="w-full bg-jeopardy-yellow text-blue-900 font-black p-4 rounded text-xl hover:brightness-110 transition shadow-lg uppercase tracking-wide"
             >
               {isRegistering ? "Register" : "Login"}
             </button>

             <button 
               onClick={() => setIsRegistering(!isRegistering)}
               className="w-full text-blue-300 hover:text-white underline text-sm font-semibold"
             >
               {isRegistering ? "Have an account? Login" : "New user? Register here"}
             </button>
           </div>
        </div>
      </div>
    );
  }

  // 2. LOBBY (Create / Join Room) - Only if not in a group yet
  if (!gameState.activeGroup) {
      return (
        <div className="min-h-screen bg-jeopardy-blue flex flex-col items-center justify-center p-4">
            <div className="absolute top-4 right-4 text-white flex items-center gap-4">
                <span className="font-bold text-jeopardy-yellow">User: {gameState.currentUser?.username}</span>
                <button onClick={logout} className="bg-red-600 px-3 py-1 rounded text-sm font-bold flex items-center gap-1"><LogOut size={14}/> Logout</button>
            </div>

            <div className="bg-jeopardy-dark border-2 border-blue-500 p-8 rounded-xl max-w-md w-full shadow-2xl">
                <h2 className="text-3xl font-black text-white mb-6 text-center uppercase">
                    {isCreatingRoom ? "Create Room" : "Join Room"}
                </h2>
                
                <div className="space-y-4">
                    <input 
                        className="w-full p-3 bg-blue-950 border border-blue-600 rounded text-white placeholder-blue-400 outline-none focus:border-white font-bold"
                        placeholder="ROOM NAME"
                        value={roomName}
                        onChange={e => setRoomName(e.target.value)}
                    />
                    <input 
                        className="w-full p-3 bg-blue-950 border border-blue-600 rounded text-white placeholder-blue-400 outline-none focus:border-white font-bold"
                        type="password"
                        placeholder="ROOM PASSWORD"
                        value={roomPass}
                        onChange={e => setRoomPass(e.target.value)}
                    />
                    
                    <button 
                        onClick={handleRoomAuth}
                        className="w-full bg-green-600 hover:bg-green-500 text-white font-black p-4 rounded text-xl transition shadow-lg uppercase tracking-wide"
                    >
                        {isCreatingRoom ? "Create" : "Join"}
                    </button>

                    <div className="flex justify-center gap-4 pt-4 border-t border-blue-800">
                        <button onClick={() => setIsCreatingRoom(true)} className={`text-sm font-bold ${isCreatingRoom ? 'text-jeopardy-yellow' : 'text-blue-400'}`}>Create Room</button>
                        <span className="text-blue-600">|</span>
                        <button onClick={() => setIsCreatingRoom(false)} className={`text-sm font-bold ${!isCreatingRoom ? 'text-jeopardy-yellow' : 'text-blue-400'}`}>Join Room</button>
                    </div>
                </div>
            </div>
        </div>
      );
  }

  // 3. ROOM DASHBOARD
  if (view === 'dashboard') {
      return (
          <div className="min-h-screen bg-jeopardy-blue text-white p-8">
              <div className="flex justify-between items-center mb-12">
                  <div>
                    <h1 className="text-4xl font-black uppercase tracking-tighter">
                        Room: <span className="text-jeopardy-yellow">{gameState.activeGroup.name}</span>
                    </h1>
                    <p className="text-blue-300 font-bold">Logged in as {gameState.currentUser?.username} {gameState.currentUser?.isAdmin && "(ADMIN)"}</p>
                  </div>
                  <button onClick={() => logout()} className="bg-red-600 px-4 py-2 rounded font-bold flex items-center gap-2"><LogOut size={16}/> Leave Room</button>
              </div>

              <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                  {/* ADD QUESTIONS */}
                  <button 
                      onClick={() => setView('editor')}
                      className="group relative h-80 bg-gradient-to-br from-blue-900 to-blue-800 rounded-2xl border-4 border-blue-600 hover:border-jeopardy-yellow transition-all hover:scale-[1.02] shadow-2xl flex flex-col items-center justify-center gap-6"
                  >
                      <PlusCircle size={64} className="text-blue-400 group-hover:text-white" />
                      <div className="text-center">
                          <h2 className="text-3xl font-black uppercase text-white mb-2">Add Content</h2>
                          <p className="text-blue-300 font-bold">Create Categories & Questions</p>
                      </div>
                  </button>

                  {/* START GAME (ADMIN ONLY) */}
                  <button 
                      onClick={() => setView('setup')}
                      disabled={!gameState.currentUser?.isAdmin}
                      className={`group relative h-80 rounded-2xl border-4 transition-all shadow-2xl flex flex-col items-center justify-center gap-6 ${
                          gameState.currentUser?.isAdmin 
                          ? 'bg-gradient-to-br from-green-900 to-green-800 border-green-600 hover:border-white hover:scale-[1.02] cursor-pointer'
                          : 'bg-gray-900 border-gray-700 opacity-50 cursor-not-allowed grayscale'
                      }`}
                  >
                      {gameState.currentUser?.isAdmin ? <Play size={64} className="text-white" /> : <Lock size={64} className="text-gray-500" />}
                      <div className="text-center">
                          <h2 className="text-3xl font-black uppercase text-white mb-2">Start Game</h2>
                          <p className="text-gray-400 font-bold">{gameState.currentUser?.isAdmin ? "Admin Access Granted" : "Waiting for Admin..."}</p>
                      </div>
                  </button>
              </div>
          </div>
      );
  }

  // 4. EDITOR
  if (view === 'editor') {
      return (
          <div className="min-h-screen bg-jeopardy-blue text-white p-4 md:p-8">
              <div className="max-w-6xl mx-auto">
                <button onClick={() => setView('dashboard')} className="mb-6 text-blue-300 hover:text-white flex items-center gap-2 font-bold"><ArrowRight className="rotate-180" /> BACK TO DASHBOARD</button>
                
                <div className="grid lg:grid-cols-2 gap-8">
                    {/* Category Creator */}
                    <div className="bg-blue-900/50 p-6 rounded-xl border-2 border-blue-700">
                        <h3 className="text-xl font-bold mb-4 text-jeopardy-yellow flex items-center gap-2">CREATE CATEGORY</h3>
                        <div className="flex gap-2 mb-6">
                            <input 
                                value={newCatTitle} 
                                onChange={e => setNewCatTitle(e.target.value)} 
                                placeholder="Category Name"
                                className="flex-1 bg-blue-950 p-3 rounded text-white outline-none border border-blue-600 focus:border-jeopardy-yellow font-bold"
                            />
                            <button onClick={handleAddCategory} className="bg-green-600 hover:bg-green-500 px-6 rounded font-black text-white uppercase tracking-wide">Add</button>
                        </div>
                        
                        <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
                            {gameState.activeGroup.categories.length === 0 && <p className="text-blue-300 italic text-center py-4">No categories created yet.</p>}
                            {gameState.activeGroup.categories.map(c => (
                                <div key={c.id} className="bg-blue-800 p-4 rounded flex justify-between items-center border border-blue-600">
                                    <span className="font-bold text-lg">{c.title}</span>
                                    <span className="text-xs font-black bg-blue-950 px-3 py-1 rounded-full text-blue-300 border border-blue-700">{c.questions?.length || 0} Qs</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Question Creator */}
                    <div className="bg-blue-900/50 p-6 rounded-xl border-2 border-blue-700">
                        <h3 className="text-xl font-bold mb-4 text-jeopardy-yellow flex items-center gap-2">ADD QUESTION</h3>
                        <div className="space-y-4">
                            <select 
                                className="w-full bg-blue-950 p-3 rounded border border-blue-600 font-bold"
                                value={qForm.catId}
                                onChange={e => setQForm({...qForm, catId: e.target.value})}
                            >
                                <option value="">Select Category...</option>
                                {gameState.activeGroup.categories.map(c => (
                                    <option key={c.id} value={c.id}>{c.title}</option>
                                ))}
                            </select>

                            <select
                                className="w-full bg-blue-950 p-3 rounded border border-blue-600 font-bold"
                                value={qForm.points}
                                onChange={e => setQForm({...qForm, points: Number(e.target.value)})}
                            >
                                {[100, 200, 300, 400, 500].map(p => <option key={p} value={p}>${p}</option>)}
                            </select>

                            <textarea 
                                    placeholder="Question..."
                                    className="w-full bg-blue-950 p-4 rounded h-32 border border-blue-600 focus:border-jeopardy-yellow outline-none text-lg font-bold"
                                    value={qForm.q}
                                    onChange={e => setQForm({...qForm, q: e.target.value})}
                            />
                            
                            <input 
                                    placeholder="Answer..."
                                    className="w-full bg-blue-950 p-4 rounded border border-blue-600 focus:border-jeopardy-yellow outline-none text-lg font-bold"
                                    value={qForm.a}
                                    onChange={e => setQForm({...qForm, a: e.target.value})}
                            />

                            <button onClick={handleAddQuestion} className="w-full bg-jeopardy-yellow hover:bg-white text-blue-900 font-black p-4 rounded text-xl flex items-center justify-center gap-2 transition uppercase tracking-widest shadow-lg">
                                <Save size={24} /> SAVE TO DB
                            </button>
                        </div>
                    </div>
                </div>
              </div>
          </div>
      );
  }

  // 5. SETUP (Admin Only - but view logic handles security too)
  if (view === 'setup') {
      return (
          <div className="min-h-screen bg-jeopardy-blue text-white p-4 md:p-8">
             <div className="max-w-5xl mx-auto">
                <button onClick={() => setView('dashboard')} className="mb-6 text-blue-300 hover:text-white flex items-center gap-2 font-bold"><ArrowRight className="rotate-180" /> BACK</button>
                <h2 className="text-3xl font-black uppercase mb-8 border-b-4 border-jeopardy-yellow pb-2 inline-block">Game Setup (Admin)</h2>

                <div className="grid md:grid-cols-2 gap-8">
                    {/* Player Setup */}
                    <div className="bg-jeopardy-dark p-6 rounded-xl border-2 border-blue-700">
                        <h3 className="text-xl font-bold mb-4 text-jeopardy-yellow uppercase tracking-wide">Add Players</h3>
                        <div className="flex gap-2 mb-6">
                            <input 
                                value={newPlayerName}
                                onChange={e => setNewPlayerName(e.target.value)}
                                placeholder="Player Name"
                                className="flex-1 bg-blue-950 p-3 rounded font-bold border border-blue-600 focus:border-white outline-none"
                            />
                            <button 
                                onClick={() => { if(newPlayerName) { addPlayer(newPlayerName); setNewPlayerName(''); }}}
                                className="bg-green-600 hover:bg-green-500 px-6 rounded font-black uppercase"
                            >
                                ADD
                            </button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {gameState.players.map(p => (
                                <span key={p.id} className="bg-blue-600 text-white font-bold px-4 py-2 rounded-full border border-blue-400 shadow-lg">{p.name}</span>
                            ))}
                        </div>
                    </div>

                    {/* Category Selection */}
                    <div className="bg-jeopardy-dark p-6 rounded-xl border-2 border-blue-700 flex flex-col h-[500px]">
                        <h3 className="text-xl font-bold mb-4 text-jeopardy-yellow uppercase tracking-wide flex justify-between">
                            <span>Select Categories</span>
                            <span className={selectedCats.length === 20 ? 'text-red-400' : 'text-blue-300'}>{selectedCats.length}/20</span>
                        </h3>
                        
                        <div className="flex-1 overflow-y-auto pr-2 space-y-6 custom-scrollbar">
                            
                            {/* CUSTOM CATEGORIES */}
                            <div>
                                <h4 className="text-sm font-black text-white bg-blue-900 px-2 py-1 rounded inline-block mb-3 uppercase tracking-wider">Room Categories</h4>
                                {gameState.activeGroup.categories.length === 0 && <p className="text-sm text-gray-500 pl-2 italic">None found.</p>}
                                <div className="space-y-2">
                                    {gameState.activeGroup.categories.map(c => (
                                        <div 
                                            key={c.id}
                                            onClick={() => toggleCatSelection(c.id)}
                                            className={`p-3 rounded border-2 cursor-pointer transition flex justify-between items-center ${
                                                selectedCats.includes(c.id) 
                                                ? 'bg-jeopardy-yellow text-blue-900 border-jeopardy-yellow font-black shadow-md transform scale-[1.02]' 
                                                : 'bg-blue-950 border-blue-800 hover:border-blue-500 text-gray-300'
                                            }`}
                                        >
                                            <span>{c.title}</span>
                                            <span className="text-xs bg-black/20 px-2 py-1 rounded">{c.questions?.length || 0} Qs</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* PRESET CATEGORIES */}
                            <div>
                                <h4 className="text-sm font-black text-white bg-purple-900 px-2 py-1 rounded inline-block mb-3 uppercase tracking-wider">Preset Libraries</h4>
                                <div className="space-y-2">
                                    {PRESET_CATEGORIES.map(c => (
                                        <div 
                                            key={c.id}
                                            onClick={() => toggleCatSelection(c.id)}
                                            className={`p-3 rounded border-2 cursor-pointer transition flex justify-between items-center ${
                                                selectedCats.includes(c.id) 
                                                ? 'bg-jeopardy-yellow text-blue-900 border-jeopardy-yellow font-black shadow-md transform scale-[1.02]' 
                                                : 'bg-purple-900/40 border-purple-800 hover:border-purple-500 text-gray-300'
                                            }`}
                                        >
                                            <span className="flex items-center gap-2">{c.title}</span>
                                            <span className="text-xs bg-black/20 px-2 py-1 rounded">{c.questions.length} Qs</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                        </div>
                    </div>
                </div>

                <button 
                    onClick={() => startGame(selectedCats)}
                    disabled={selectedCats.length === 0 || gameState.players.length === 0}
                    className="mt-8 w-full bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 disabled:opacity-50 disabled:cursor-not-allowed p-6 rounded-xl text-3xl font-black shadow-2xl uppercase tracking-widest border-4 border-green-700 hover:border-green-300 transition transform hover:-translate-y-1 active:translate-y-0"
                >
                    Start Game
                </button>
             </div>
          </div>
      );
  }

  return null;
};
