import ui from "./ui.js";
import consultas from "./consultas.js";

export default function form(){
    const form = document.querySelector('form')
    form.addEventListener('submit', e => validarSubmit(e))

    function validarSubmit(e){
        e.preventDefault()
        const value = form.input.value

        if(Boolean(value)){
            consultas.consultar(value) 
            sincronizarStorage(value)
            return
        }

        ui.campoVacio()
    }

    function sincronizarStorage(word){
        localStorage.setItem("busqueda", word)
    }
}