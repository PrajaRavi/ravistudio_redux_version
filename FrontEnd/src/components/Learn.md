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

$addToSet:✅✅✅✅✅
  Inserts into array only if value does not already exist
  Prevents duplicates automatically
  Is atomic (safe for concurrent requests)
  No manual checks needed

1️⃣ Code loading(also called code splitting)
➡️ When should the JS code of the component be downloaded?
2️⃣ Component rendering
➡️ When should React actually render it into the DOM?
👉 Lazy loading solves ONLY problem #1
👉 IntersectionObserver solves problem #2


<----------------------------Concept of throttle and debounce------------------------------->
->Both are just techniques used to only trigger a function after a fix interval of time
Throttle->it is useful when we want to call a function after a fix interval of time and also we can give a max limit
Debouncing->for ex->on scroll function if i execute my function A onscroll then it it is normal and if i call it after 2s or a fix interval of time using setinterval then it is throttle but if some how i call it after scrollend then it is debouncing

<---------------------------google LightHouse------------------------------>
->Their is a big problem in react(we know that in any component whenever any state changes then re-render occurs so it will also render it's child component although we are not using that state in the child component )

->React.memo->is a HOC->Higher order component just like higher order function (HOF)->which takes function inside it as params so HOC->component which takes a new component as params inside it

<------------------Interceptors in axios------------------------->
🧠 First: what is an Axios interceptor?
Think of an interceptor as a security guard 🚨 standing before every request and after every response.
Axios gives you two types:
Request interceptors → run before request is sent
Response interceptors → run after response is received
















  