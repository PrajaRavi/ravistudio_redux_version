import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {Helmet} from "react-helmet-async"
import axios from "axios"
import {
  Users,
  MessageCircle,
  Star,
  Trash2,
  Edit,
  X,
  BarChart3,
} from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("users");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteType, setDeleteType] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const CurrUser=useSelector(state=>state.User.CurrUser)
  let [apicalled,setapicalled]=useState(false)  

  //----------------------> managing users
  let [users,setusers]=useState([])
  let [pageforuser,setpageforuser]=useState(1)

  //----------------------> managing contacts
  let [contacts,setcontacts]=useState([])
  let [pagefocontact,setpagefocontact]=useState(1)

  //----------------------> managing reviews
  let [reviews,setreviews]=useState([])
  let [pagefoReview,setpagefoReview]=useState(1)


  // --------------------------->managing users
  const GetAllUser=async(page,limit=9)=>{
    let {data}=await axios.get(`http://localhost:4500/user/get-all-user/?page=${page}&limit=${limit}`)
    if(data.success){
      setusers(data.users)
    }else{
      toast.error("something went wrong in admin panal")
    }
  }
 const DeleteUser=async()=>{
    let {data}=await axios.get(`http://localhost:4500/user/get-all-user/?page=${page}&limit=${limit}`)
    if(data.success){
      setusers(data.users)
    }else{
      toast.error("something went wrong in admin panal")
    }
 } 

  const GetAllContacts=async(page,limit=9)=>{
    let {data}=await axios.get(`http://localhost:4500/contact/get-contact-detail/?page=${page}&limit=${limit}`)
    if(data.success){
      setcontacts(data.contact)
    }else{
      toast.error("something went wrong in admin panal")
    }
  }
  
  const GetAllReviews=async(page,limit=9)=>{
    let {data}=await axios.get(`http://localhost:4500/review/get-all-review/?page=${page}&limit=${limit}`)
    if(data.success){
      setreviews(data.review)
    }else{
      toast.error("something went wrong in admin panal")
    }
  }
  


  // Demo Data
  // const users = [
  //   { id: "u1", name: "Aman", email: "aman@mail.com" },
  //   { id: "u2", name: "Ravi", email: "ravi@mail.com" },
  // ];

  // const contacts = [
  //   { id: "c1", name: "John", email: "john@mail.com", message: "Need help with playlist" },
  // ];


  const chartData = [
    { name: "Jan", users: 20, contacts: 5, reviews: 10 },
    { name: "Feb", users: 40, contacts: 12, reviews: 18 },
    { name: "Mar", users: 60, contacts: 20, reviews: 30 },
    { name: "Apr", users: 80, contacts: 25, reviews: 45 },
    { name: "May", users: 120, contacts: 40, reviews: 60 },
  ];

  const openDeleteModal = (type, id) => {
    setDeleteType(type);
    setDeleteId(id);
    setConfirmOpen(true);
  };

  const handleDelete = async () => {
    if(String(deleteType).includes("contact")){
      let {data}=await axios.delete(`http://localhost:4500/contact/delete-contact-detail/${deleteId}`)
    if(data.success){
    setConfirmOpen(false);
    setapicalled(!apicalled)
  }else{
  toast.error("something went wrong in admin panal")
}
}
else if(String(deleteType).includes("review")){
      
      let {data}=await axios.delete(`http://localhost:4500/review/delete-review/${deleteId}`)
    if(data.success){
    setConfirmOpen(false);
    setapicalled(!apicalled)
  }else{
  toast.error("something went wrong in admin panal")
}

    }
    else if(String(deleteType).includes("user")){
      
      if(deleteId===CurrUser._id){
        toast.warn("you can't delete yourself")
        setapicalled(!apicalled)
        setConfirmOpen(false)

      }
      else{
        toast.warn("implement karna hai")
      }
    }

  };
  useEffect(()=>{  
    GetAllUser(pageforuser)
    GetAllContacts(pagefocontact)
    GetAllReviews(pagefoReview)
  },[apicalled])

  return (
    <>
    <Helmet>
            <title>Admin Page | My Music App</title>
    
            <meta
              name="description"
              content="Listen to trending playlists and curated songs updated daily."
            />
          </Helmet>
    <div className="min-h-screen z-50 w-full bg-black text-white flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="md:w-64 w-full md:min-h-screen bg-white/5 backdrop-blur-xl border-r border-white/10">
        <div className="p-6 text-xl font-bold">Admin Panel</div>
        <div className="flex md:flex-col gap-2 px-4 pb-4">
          <SidebarButton icon={<BarChart3 />} label="Analytics" active={activeTab === "analytics"} onClick={() => setActiveTab("analytics")} />
          <SidebarButton icon={<Users />} label="Users" active={activeTab === "users"} onClick={() => setActiveTab("users")} />
          <SidebarButton icon={<MessageCircle />} label="Contacts" active={activeTab === "contacts"} onClick={() => setActiveTab("contacts")} />
          <SidebarButton icon={<Star />} label="Reviews" active={activeTab === "reviews"} onClick={() => setActiveTab("reviews")} />
        </div>
      </aside>

      {/* Content */}
      <main className="flex-1 w-full p-4 md:p-8">
        <AnimatePresence mode="wait">

          {/* Analytics */}
          {activeTab === "analytics" && (
            <motion.div key="analytics" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="w-full">
              <h2 className="text-2xl font-semibold mb-6">Dashboard Analytics</h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 w-full">
                <StatCard title="Total Users" value={users?.length} />
                <StatCard title="Total Contacts" value={contacts?.length} />
                <StatCard title="Total Reviews" value={reviews?.length} />
                <StatCard title="Growth" value="+12%" />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
                <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                  <p className="mb-4 text-gray-300">User Growth</p>
                  <ResponsiveContainer width="100%" height={280}>
                    <LineChart data={chartData}>
                      <XAxis dataKey="name" stroke="#aaa" />
                      <YAxis stroke="#aaa" />
                      <Tooltip />
                      <Line type="monotone" dataKey="users" stroke="#a855f7" strokeWidth={3} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                  <p className="mb-4 text-gray-300">Contacts vs Reviews</p>
                  <ResponsiveContainer width="100%" height={280}>
                    <BarChart data={chartData}>
                      <XAxis dataKey="name" stroke="#aaa" />
                      <YAxis stroke="#aaa" />
                      <Tooltip />
                      <Bar dataKey="contacts" fill="#22c55e" />
                      <Bar dataKey="reviews" fill="#3b82f6" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </motion.div>
          )}

          {/* Users */}
          {activeTab === "users" && (
            <motion.div key="users" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <h2 className="text-2xl font-semibold mb-4">Users</h2>
              <Table>
                <thead><tr><Th>Sr</Th><Th>Name</Th><Th>Email</Th><Th>ID</Th><Th>Action</Th></tr></thead>
                <tbody>{users?.map((u,i)=>(<tr key={u._id}><Td>{i+1}</Td><Td>{`${u.firstName} ${u.lastName}`}</Td><Td>{u.email}</Td><Td>{u._id}</Td><Td className="flex gap-2"><IconButton icon={<Edit size={16}/>} /><IconButton icon={<Trash2 size={16}/>} danger onClick={()=>openDeleteModal("user",u._id)} /></Td></tr>))}</tbody>
              </Table>
            </motion.div>
          )}

          {/* Contacts */}
          {activeTab === "contacts" && (
            <motion.div key="contacts" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <h2 className="text-2xl font-semibold mb-4">Contacts</h2>
              <Table>
                <thead><tr><Th>Sr</Th><Th>ID</Th><Th>Name</Th><Th>Email</Th><Th>Message</Th><Th>Action</Th></tr></thead>
                <tbody>{contacts?.map((c,i)=>(<tr key={c._id}><Td>{i+1}</Td><Td>{c._id}</Td><Td>{c.name}</Td><Td>{c.email}</Td><Td className="max-w-xs truncate">{c.message}</Td><Td><IconButton icon={<Trash2 size={16} />}  danger onClick={()=>openDeleteModal("contact",c._id)}/></Td></tr>))}</tbody>
              </Table>
            </motion.div>
          )}

          {/* Reviews */}
          {activeTab === "reviews" && (
            <motion.div key="reviews" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <h2 className="text-2xl font-semibold mb-6">Reviews</h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {reviews?.map(r=>(<motion.div key={r._id} whileHover={{scale:1.03}} className="relative bg-white/5 border border-white/10 rounded-xl p-4"><button onClick={()=>openDeleteModal("review",r._id)} className="absolute top-2 right-2 text-gray-400 hover:text-red-500"><X size={16}/></button><p className="text-gray-200">{r.message}</p></motion.div>))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Delete Modal */}
      <AnimatePresence>{confirmOpen && (<motion.div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}><motion.div initial={{scale:0.8}} animate={{scale:1}} className="bg-black border border-white/10 rounded-xl p-6 w-full max-w-sm"><h3 className="text-lg font-semibold mb-3">Confirm Delete</h3><p className="text-gray-400 mb-6">Are you sure you want to delete this {deleteType}?</p><div className="flex justify-end gap-3"><button onClick={()=>setConfirmOpen(false)} className="px-4 py-2 rounded-lg bg-white/10">Cancel</button><button onClick={handleDelete} className="px-4 py-2 rounded-lg bg-red-600">Delete</button></div></motion.div></motion.div>)}</AnimatePresence>
    </div>
    </>

  );
}

/* ---------- Components ---------- */
function SidebarButton({icon,label,active,onClick}){return <button onClick={onClick} className={`flex items-center gap-3 px-4 py-3 rounded-xl transition ${active?"bg-purple-600":"hover:bg-white/10"}`}>{icon}<span>{label}</span></button>;}
function StatCard({title,value}){return <motion.div whileHover={{scale:1.05}} className="bg-white/5 border border-white/10 rounded-xl p-6"><p className="text-gray-400 text-sm">{title}</p><h3 className="text-3xl font-bold mt-2">{value}</h3></motion.div>;}
function Table({children}){return <div className="overflow-x-auto rounded-xl border border-white/10"><table className="w-full text-sm">{children}</table></div>;}
function Th({children}){return <th className="px-4 py-3 text-left bg-white/5 border-b border-white/10">{children}</th>;}
function Td({children,className=""}){return <td className={`px-4 py-3 border-b border-white/10 text-gray-300 ${className}`}>{children}</td>;}
function IconButton({icon,danger,onClick}){return <button onClick={onClick} className={`p-2 rounded-lg transition ${danger?"hover:bg-red-500/20 text-red-400":"hover:bg-white/10"}`}>{icon}</button>;}