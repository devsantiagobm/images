import consulta from "./consultas.js";

class UI {
    campoVacio() {
        const input = document.querySelector('.input')
        input.classList.add('input--wrong')

        setTimeout(() => input.classList.remove('input--wrong'), 500);
    }

    mostrarDatos(datos) {
        if(datos.totalHits === 0 ) {
            ui.datosNoEncontrados()
            return
        }

        this.limpiarHTML(document.querySelector('#resultado'))
        this.limpiarHTML(document.querySelector('#paginacion'))
        this.loader()

        const imagenes = datos.hits;
        const resultado = document.querySelector('#resultado')

        imagenes.forEach(imagen => {
            const box = document.createElement('div')

            box.innerHTML = this.hacerHTML(imagen)
            box.classList.add('resultado__elemento')
            
            this.intersection(box)
            resultado.appendChild(box)
        });
        
        this.verificarImagenesCargadas()
        this.generarPaginacion(datos)
    }

    datosNoEncontrados(){
        const noEncontrado = document.querySelector('.no-encontrado')
        const word = document.querySelector('.word')
        const value = document.querySelector('#termino')
        noEncontrado.style.maxHeight = `${noEncontrado.scrollHeight + 16}px`
        noEncontrado.style.padding = `8px 0`
        word.textContent = value.value
    }

    intersection(box){
        const observer = new IntersectionObserver( elemento => {

            if(elemento[0].isIntersecting){
                elemento[0].target.classList.add('resultado__elemento--active')
            }

        })
        observer.observe(box)
    }

    hacerHTML(imagen) {
        const { largeImageURL, likes, comments, tags, pageURL } = imagen;
        return `
        <a class="resultado__contenedor" target="_blank" href=${pageURL}>
            <img class="resultado__imagen" src=${largeImageURL} alt=${tags} />
            <div class="resultado__informacion">

                <ul class="resultado__list">
                    <li class="list__items">
                        <img src="assets/heart.svg" alt="heart__icon" class="resultado__icon">
                        <span class="resultado__number">${likes}</span>
                    </li>
                    <li class="list__items">
                        <img src="assets/comment.svg" alt="heart__icon" class="resultado__icon">
                        <span class="resultado__number">${comments}</span>
                    </li>
                </ul>

            </div>
        </a>`
    }

    loader() {
        const loader = document.querySelector('.loader')
        const noEncontrado = document.querySelector('.no-encontrado')
        noEncontrado.style.maxHeight = `0px`
        noEncontrado.style.padding = `0px`
        loader.style.opacity = "1"
    }

    ocultarLoader() {
        const loader = document.querySelector('.loader')
        loader.style.opacity = "0"
    }

    limpiarHTML(elemento) {
        while (elemento.firstChild) {
            elemento.removeChild(elemento.firstChild)
        }
    }

    verificarImagenesCargadas() {
        const imagenes = Array.from(document.querySelectorAll('imagenes'))

        const intervalo = setInterval(() => {
            const imagenesCargadas = imagenes.every(imagen =>  imagen.complete && imagen.naturalHeight  !== 0)
            
            if(imagenesCargadas){
                clearInterval(intervalo)
                this.mostrarContenido()
                this.ocultarLoader()
                return;
            }

        }, 1000);

    }

    mostrarContenido(){
        const resultado = document.querySelector('#resultado')
        resultado.style.display = `block`;
        resultado.style.padding = "clamp(60px, 15vh, 90px) 0"
        
        window.scroll({
            top: resultado.offsetTop,
            left:0,
            behavior: "smooth"
        })
    }

    generarPaginacion(datos){
        const total = datos.totalHits
        const imagenesPorPagina = 20
        let botonesNecesarios = Math.ceil(total / imagenesPorPagina)
        botonesNecesarios = botonesNecesarios >= 10 ? 10 : botonesNecesarios  
        
        for(let i = 1; i<=botonesNecesarios; i++){
            this.crearBotonPaginacion(i)
        }

        this.eventoPaginacion()
    }

    crearBotonPaginacion(number){
        const box = document.createElement('div')
        const paginacionBox = document.querySelector('#paginacion')
        box.classList.add('paginacion__item')
        box.textContent = number;

        paginacionBox.appendChild(box)

        number === Number( localStorage.getItem("pagina") ) 
        && box.classList.add('paginacion__item--active')
    }

    eventoPaginacion(){
        const paginacion = document.querySelector('#paginacion')
        paginacion.addEventListener('click', e => {

            if(e.target.classList.contains('paginacion__item')){
                
                this.cambiarDePagina(e)

            }
        })
    }

    cambiarDePagina(e){
        const palabraBuscada = localStorage.getItem("busqueda")
        const pagina = e.target.textContent

        consulta.consultar(palabraBuscada, pagina)
    }

    
}

const ui = new UI()
export default ui

// ARREGLAR LAS CLASES DE LOS BOTONES DE LA PAGINACIÓN
// ARREGLAR EL TAMAÑO DE LOS RESULTADOS Y LA PAGINACIÓN AL MOMENTO DE DAR CLICK EN UN BOTÓN