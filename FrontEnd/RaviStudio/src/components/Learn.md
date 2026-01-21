->React Render LifeCycle
  function Profile() {
    const [user, setUser] = useState(null);
    console.log("Render, user =", user);
    function fetchUser(){
      setUser("hello")
    }
    useEffect(() => {
      fetchUser();
    }, []);
    return <div>{user?.name}</div>;
  }
🟢 Step 1: Component Function is CALLED->Profile()
🟢 Step 2: useState is INITIALIZED (FIRST TIME ONLY) user=null (This happens before any UI appears
🟢 Step 3: JSX is Evaluated
          user is null
          user?.name → undefined(but no crash because of ?)
          React renders empty UI (no crash)
🟢 Step 4: Browser Paints UI
          At this moment:
          UI is visible
          State values are initial values
          useEffect has NOT run yet         
🟡 Step 5: useEffect Runs (AFTER UI PAINT)
📌 useEffect never runs before first render
🟡 Step 6: API Call Finishes → State Updates
    setUser({ name: "Aman" });
  "State changed — re-render this component"   
React calls the component again:Profile()
  But this time:
      useState does NOT reinitialize
      React gives updated state

<-------------------------------------------------------------------------->
🔥 Key Rule (MEMORIZE THIS)
❗ useState initializes before UI loads
❗ useEffect runs after UI loads
❗ State change hoga to re-render bhi hoga 

->Reat first loads ui part and then it loads useffect
1️⃣ Component function runs
2️⃣ useState initialized
3️⃣ JSX returned
4️⃣ UI painted
5️⃣ useEffect runs
6️⃣ API returns
7️⃣ setState
8️⃣ Re-render

->***Never use state just after dispatch() the action instaed use useEffect hook to use the state and inside the dependency array pass these states so that whenever these state will be changed then useEffect runs and state will be used(SignInPage)








  