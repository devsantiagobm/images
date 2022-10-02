import ui from "./ui.js";
class Consultas{
    consultar(word,page = 1){
        const key = "30307805-dc2c189a1ce34bc97bafc2bfb"
        const url = `https://pixabay.com/api/?key=${key}&q=${word}&image_type=photo&page=${page}`
        localStorage.setItem("pagina", page);


        fetch(url)
        .then(resultado => resultado.json())
        .then(datos => ui.mostrarDatos(datos))
    }
}

const consulta = new Consultas()
export default consulta