const supabaseUrl = 'https://qvlmbyqbewerfbplpdau.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF2bG1ieXFiZXdlcmZicGxwZGF1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY2NTY1MjUsImV4cCI6MjA3MjIzMjUyNX0.UlH5PkMaqwXHMneHXcOKBQSFw6R_h1hjKCnV_dI8UwA';

const supabase = supabase.createClient(supabaseUrl, supabaseKey);

// 🔹 Login
async function login(){
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const { error } = await supabase.auth.signIn({ email, password });
  if(error) document.getElementById("error").innerText = error.message;
  else window.location="dashboard.html";
}

// 🔹 Signup
async function signup(){
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const { error } = await supabase.auth.signUp({ email, password });
  if(error) document.getElementById("error").innerText = error.message;
  else window.location="dashboard.html";
}

// 🔹 Logout
async function logout(){
  await supabase.auth.signOut();
  window.location="index.html";
}

// 🔹 Dashboard tasks
async function loadTasks(){
  const user = supabase.auth.user();
  if(!user) { window.location="index.html"; return; }
  const { data: tasks } = await supabase.from('tasks').select('*').eq('user_id', user.id);
  const list = document.getElementById("taskList");
  list.innerHTML = "";
  tasks.forEach(t=>{
    const li = document.createElement("li");
    li.textContent = `[${t.category}] ${t.title}`;
    if(t.done) li.classList.add("done");
    li.onclick=()=>toggleDone(t.id, t.done);
    const delBtn = document.createElement("button");
    delBtn.textContent="x";
    delBtn.onclick=(e)=>{ e.stopPropagation(); deleteTask(t.id); };
    li.appendChild(delBtn);
    list.appendChild(li);
  });
}

// 🔹 Ajouter tâche
async function addTask(){
  const title = document.getElementById("taskTitle").value;
  const category = document.getElementById("taskCategory").value;
  const user = supabase.auth.user();
  if(!title) return;
  await supabase.from('tasks').insert([{title, category, user_id:user.id}]);
  document.getElementById("taskTitle").value="";
  document.getElementById("taskCategory").value="";
  loadTasks();
}

// 🔹 Toggle done
async function toggleDone(id, done){
  const user = supabase.auth.user();
  await supabase.from('tasks').update({done:!done}).eq('id',id).eq('user_id',user.id);
  loadTasks();
}

// 🔹 Delete
async function deleteTask(id){
  const user = supabase.auth.user();
  await supabase.from('tasks').delete().eq('id',id).eq('user_id',user.id);
  loadTasks();
}

// 🔹 Auto load
supabase.auth.onAuthStateChange(()=>{ if(window.location.pathname.includes("dashboard.html")) loadTasks(); });
