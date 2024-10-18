var weight = 0;
var elevation_gain = 0;
var average_grade = 0; 

// Función para cargar la información del usuario
async function cargarDatosUsuario() {
    try {
        const response = await fetch('/api/userinfo');
        const result = await response.json();

        // Mostrar la información del usuario
        weight = result.weight;
        
        let h2 = document.getElementById('userName');
        h2.innerText = `${result.firstname} ${result.lastname}`;

        let div = document.getElementById('userList');
        div.innerHTML = '';  // Esto borra todo el contenido anterior del <ul>
        
        let city = document.createElement('p');
        let kg = document.createElement('p');
        kg.setAttribute('id','weight')

        city.textContent = `${result.city}-${result.state}`; // Añadir el texto al li
        kg.textContent = `Peso: ${result.weight} kg`; // Añadir el texto al li
        
        div.appendChild(city); 
        div.appendChild(kg); 

        let imgProfileUser = document.getElementById('picture');
        imgProfileUser.src = result.profile

    } catch (error) {
        window.location = 'index.html'
        console.error('Error al cargar la información del usuario:', error);
    }
}
// Cargar los datos del usuario al cargar la página
cargarDatosUsuario();

async function cargarSegmentosFavoritos() {
    try {
        const response = await fetch('/api/userSegmentsStarred');
        const result = await response.json();
        
        var table = document.querySelector(".tableSegments");
        result.forEach(value => {
        var tr = document.createElement("tr");
        tr.innerHTML = `<tr> 
                            <td><button onclick="infoSegmento(${value.id})">${value.name}</button></td> 
                        </tr>`;
        table.appendChild(tr);
        })

        
        /*window.location=user.html?segmento=${value.id} var select = document.querySelector("#climbs")
        result.forEach(element => {
            var option = document.createElement("option");
            option.value = element.id;   // Establecer el valor de la opción
            option.text = element.name;    // Establecer el texto visible de la opción
            select.appendChild(option); 
        }) */
        
        /* select.addEventListener('change', function(){
            infoSegmento(select.value)
            
        }) */
       

    } catch (error) {
        window.location = 'index.html'
        console.error('Error al cargar la información de los segmentos:', error);
    }
}
cargarSegmentosFavoritos()

async function infoSegmento(id) {
    try {
        const response = await fetch(`/api/segmentInfo?id=${id}`);
        const result = await response.json();

        elevation_gain = parseInt(result.elevation_high - result.elevation_low);
        average_grade = result.average_grade
        pr = secondsToString(result.athlete_segment_stats.pr_elapsed_time)

        document.getElementById('segmentName').innerText = result.name;
        
        let ul = document.getElementById('list');
        ul.innerHTML = '';  // Esto borra todo el contenido anterior del <ul>
        let li1 = document.createElement('li');
        let li2 = document.createElement('li');
        let li3 = document.createElement('li');
        let li4 = document.createElement('li');
        let li5 = document.createElement('li');

        li1.textContent = `Distancia: ${result.distance} mts`; // Añadir el texto al li
        li2.textContent = `Grado Promedio: ${result.average_grade} %`; // Añadir el texto al li
        li3.textContent = `Categoria del Puerto: ${result.climb_category} `; // Añadir el texto al li
        li4.textContent = `Desnivel Positivo: ${elevation_gain} mts`; // Añadir el texto al li
        li5.textContent = `Tu PR: ${pr} seg`; // Añadir el texto al li
        
        ul.appendChild(li1); 
        ul.appendChild(li2); 
        ul.appendChild(li3); 
        ul.appendChild(li4); 
        ul.appendChild(li5); 

        let imgProfile = document.getElementById('profile');
        imgProfile.src = result.elevation_profile
        document.querySelector(".containerInfoSegmento").style.display = 'block';
        document.getElementById("info").style.display = 'block';

        let minutes = document.getElementById('minutes');
        let hour = document.getElementById('hour');
        hour.addEventListener('input', function(){
            watts();
        })
        minutes.addEventListener('input', function(){
            watts();
        })
        //watts();
    } catch (error) {
        
        console.error('Error al cargar la información del segmento:', error);
    }
}


function watts(){
    
    let minutes = document.getElementById('minutes') || 0;
    let hour = document.getElementById('hour') || 0;
   
    
    let minuts = (parseInt(minutes.value) || 0);
    let hr = (parseInt(hour.value) || 0);
    let time = (hr*60)+minuts

    let vam = time == 0 ? '' : (elevation_gain/(time/60)).toFixed(0);
    let w;

    w_kg = time == 0 ? '' : ((vam)/(((20+parseFloat(average_grade))/10)*100)).toFixed(1);
    w = w_kg*weight;

    document.getElementById('valw_kg').innerHTML = w_kg ;
    document.getElementById('watts').innerHTML = w.toFixed(1);
    document.getElementById('vam').innerHTML = vam ;
    
}

function secondsToString(seconds) {
    var hour = Math.floor(seconds / 3600);
    hour = (hour < 10)? '0' + hour : hour;
    var minute = Math.floor((seconds / 60) % 60);
    minute = (minute < 10)? '0' + minute : minute;
    var second = seconds % 60;
    second = (second < 10)? '0' + second : second;
    return hour + ':' + minute + ':' + second;
  }