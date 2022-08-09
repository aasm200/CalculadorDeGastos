//variables
const formulario = document.querySelector('#agregar-gasto');
const gastoListado = document.querySelector('#gastos ul');


//eventos 
eventListeners();
function eventListeners() {
    document.addEventListener('DOMContentLoaded', preguntarPresupuesto);
    formulario.addEventListener('submit',agregarGasto);
}

//classes
class Presupuesto {
    constructor(presupuesto) {
        this.presupuesto = Number(presupuesto);
        this.restante =  Number(presupuesto);
        this.gastos = [];
    }

    nuevoGasto(gasto) {
       this.gastos =[...this.gastos,gasto];
       this.calcularRestante();
    }

    calcularRestante(){
        const gastado = this.gastos.reduce((total,gasto)=> total + gasto.cantidad, 0);
        this.restante = this.presupuesto-gastado;
    }

    elminarGasto(id) {
        this.gastos = this.gastos.filter(gasto => gasto.id !== id);
        this.calcularRestante();
        
    }
}

class UI {
    insertarPresupuesto(cantidad) {
        //extraer valor del objeto
     const {restante, presupuesto} = cantidad;
        // asignar valor al HTML
     document.querySelector('#total').textContent = presupuesto;
     document.querySelector('#restante').textContent = restante;

    }

    imprimirAlerta(mensaje,tipo) {

        // borrarMensajes();

        //crear el div 
        const divMensaje = document.createElement('div');
        divMensaje.classList.add('text-center', 'alert');

        if(tipo === 'error'){
            divMensaje.classList.add('alert-danger');
        } else {
            divMensaje.classList.add('alert-success');
        }

         //mensaje de error
         divMensaje.textContent = mensaje;

         //insertamos en html
        
         document.querySelector('.primario').insertBefore(divMensaje,formulario);

         setTimeout(() => {
            divMensaje.remove();
         }, 3000);  
    }

    mostrarGastos(gastos) {
        
        this.limpiarHTML();
        
        //iterar sobre los gastos
        gastos.forEach(gasto => {

            const {cantidad, nombre,id} = gasto;
            
            //crear li
            const nuevoGasto = document.createElement('li');
            nuevoGasto.className = 'list-group-item d-flex justify-content-between align-items-center';
            nuevoGasto.dataset.id = id; //agregamos atributo personalizado
            //agregar el gasto al html del gasto
            nuevoGasto.innerHTML = `${nombre}<span class="badge badge-primary badge-pill">  $ ${cantidad}</span>`;

            //boton para borrar el gasto
            const btnBorrar = document.createElement('button');
            btnBorrar.classList.add('btn','btn-danger','borrar-gasto');
            btnBorrar.innerHTML = 'BORRAR &times';
            btnBorrar.onclick = ()=> {
                elminarGasto(id);
            }
            nuevoGasto.appendChild(btnBorrar);
            
            //agregar al html
            gastoListado.appendChild(nuevoGasto);

        });
    }

    actulizarRestante(restante){
        document.querySelector('#restante').textContent = restante;
    }
    
    limpiarHTML() {
        while(gastoListado.firstChild){
             gastoListado.removeChild(gastoListado.firstChild);
        }
    }

    comprobarPresupuesto(presupuestoObj){
        const {presupuesto, restante}  = presupuestoObj;
        const restanteDiv = document.querySelector('.restante');
        
        //comprobar 25% 
        if((presupuesto/4) > restante ) {
            restanteDiv.classList.remove('alert-success','alert-warning');
            restanteDiv.classList.add('alert-danger');
        } else if ( (presupuesto/2) > restante) {
            restanteDiv.classList.remove('alert-success');
            restanteDiv.classList.add('alert-warning');

        } else {
            restanteDiv.classList('alert-danger','alert-warning');
            restanteDiv.classList.add('alert-success');
        }

        if(restante <=0) {
            this.imprimirAlerta('el presupuesto se ha agotado', 'error');

            formulario.querySelector('button[type="submit"]').disabled = true;
        }
    }
}

//instanciar
const ui = new UI();
let presupuesto;

//funciones

function preguntarPresupuesto() {
    const presupuestoUsuario = prompt('¿Cual es tu Presupuesto?');


    if(presupuestoUsuario === '' || presupuestoUsuario === null || isNaN(presupuestoUsuario) || presupuestoUsuario <= 0) {
        window.location.reload(); 
    }

    presupuesto = new Presupuesto(presupuestoUsuario);
   

    ui.insertarPresupuesto(presupuesto); 
}

function agregarGasto(e) {
    e.preventDefault();
    const nombre = document.querySelector('#gasto').value;
    const cantidad = Number(document.querySelector('#cantidad').value);

    //validar

    if(nombre === '' || cantidad === '') {
        ui.imprimirAlerta('Ambos Campos Son Obligatorios','error');
        return;
    } else if (cantidad<=0 || isNaN(cantidad)) {
        ui.imprimirAlerta('Cantidad no Valida','error');
        return;
    }

    //genera un objeto con el gasto
    const gasto = {nombre , cantidad , id: Date.now() };
    //añade un nuevo gasto a nuestro arreglo de gastos
    presupuesto.nuevoGasto(gasto);

    //imprime una alerta de gasto creado correctamente
    ui.imprimirAlerta('Gasto Agregado Correctamente');


    //imprmir los gastos
    const {gastos,restante} = presupuesto; 
    
    ui.mostrarGastos(gastos);  

    ui.actulizarRestante(restante);
    
    ui.comprobarPresupuesto(presupuesto);

    //reinicia el formulario
    formulario.reset();
}

function borrarMensajes() {
    const mensaje = document.querySelector('.alert-danger');
    if(mensaje !== null) {
        mensaje.remove();
    } 
}

function elminarGasto(id) {
    presupuesto.elminarGasto(id);
    const {gastos,restante} = presupuesto;
    ui.mostrarGastos(gastos);   
    ui.actulizarRestante(restante);
    ui.comprobarPresupuesto(presupuesto);
}