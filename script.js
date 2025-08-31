// 🔹 Variable client Supabase (sera initialisée après DOMContentLoaded)
let supabaseClient;

// 🔹 Initialisation après DOM et module prêts
document.addEventListener("DOMContentLoaded", () => {
    supabaseClient = supabase.createClient(
        'https://qvlmbyqbewerfbplpdau.supabase.co',
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF2bG1ieXFiZXdlcmZicGxwZGF1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY2NTY1MjUsImV4cCI6MjA3MjIzMjUyNX0.UlH5PkMaqwXHMneHXcOKBQSFw6R_h1hjKCnV_dI8UwA'
    );

    // 🔹 Déclarer les fonctions globales pour HTML
    window.login = login;
    window.signup = signup;
    window.logout = logout;
    window.addTask = addTask;
    window.toggleDone = toggleDone;
    window.deleteTask = deleteTask;

    // 🔹 Auto load des tâches si dashboard
    if(window.location.pathname.includes("dashboard.html")) loadTasks();
});

// 🔹 LOGIN (Supabase v2)
async function login() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const { data, error } = await supabaseClient.auth.signInWithPassword({
        email: email,
        password: password
    });

    if(error) document.getElementById("error").innerText = error.message;
    else window.location = "dashboard.html";
}

// 🔹 SIGNUP (Supabase v2)
async function signup() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const { data, error } = await supabaseClient.auth.signUp({
        email: email,
        password: password
    });

    if(error) document.getElementById("error").innerText = error.message;
    else window.location = "dashboard.html";
}

// 🔹 LOGOUT
async function logout() {
    await supabaseClient.auth.signOut();
    window.location = "index.html";
}

// 🔹 LOAD TASKS
async function loadTasks() {
    const user = supabaseClient.auth.getUser ? (await supabaseClient.auth.getUser()).data.user : null;
    if(!user) { window.location="index.html"; return; }

    const { data: tasks } = await supabaseClient.from('tasks').select('*').eq('user_id', user.id);
    const list = document.getElementById("taskList");
    list.innerHTML = "";

    tasks.forEach(t => {
        const li = document.createElement("li");
        li.textContent = `[${t.category}] ${t.title}`;
        if(t.done) li.classList.add("done");
        li.onclick = () => toggleDone(t.id, t.done);

        const delBtn = document.createElement("button");
        delBtn.textContent = "x";
        delBtn.onclick = (e) => { e.stopPropagation(); deleteTask(t.id); };
        li.appendChild(delBtn);

        list.appendChild(li);
    });
}

// 🔹 ADD TASK
async function addTask() {
    const title = document.getElementById("taskTitle").value;
    const category = document.getElementById("taskCategory").value;
    const user = supabaseClient.auth.getUser ? (await supabaseClient.auth.getUser()).data.user : null;
    if(!title || !user) return;

    await supabaseClient.from('tasks').insert([{ title, category, user_id: user.id }]);
    document.getElementById("taskTitle").value = "";
    document.getElementById("taskCategory").value = "";
    loadTasks();
}

// 🔹 TOGGLE DONE
async function toggleDone(id, done) {
    const user = supabaseClient.auth.getUser ? (await supabaseClient.auth.getUser()).data.user : null;
    if(!user) return;

    await supabaseClient.from('tasks').update({ done: !done }).eq('id', id).eq('user_id', user.id);
    loadTasks();
}

// 🔹 DELETE TASK
async function deleteTask(id) {
    const user = supabaseClient.auth.getUser ? (await supabaseClient.auth.getUser()).data.user : null;
    if(!user) return;

    await supabaseClient.from('tasks').delete().eq('id', id).eq('user_id', user.id);
    loadTasks();
}
