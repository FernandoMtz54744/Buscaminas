import { useReducer, useRef } from 'react';
import './App.css';


const crearArray = (n) => Array.from(Array(n))

const generarTablero = ({rows, columns, minas})=>{
  const tablero =  crearArray(rows).map( ()=>
    crearArray(columns).map(_ => (
      {visibility: false, info: 0}
      ))
    );

  const randomCell = () =>{
    return {row: Math.floor(Math.random()*rows), col: Math.floor(Math.random()*columns)}
  }

  for(let i=0; i<minas; i++){
    const {row, col} = randomCell();
    tablero[row][col].info = "mina";
  }


  for(let i=0; i< rows; i++){
    for(let j=0; j<columns; j++){
      const cell = tablero[i][j];
      if(cell.info === "mina"){
        continue
      }

      let minaNears=0;
      const moveAxis = [-1,0,1];
      for(const dx of moveAxis){
        for(const dy of moveAxis){
          if(tablero[i+dx]?.[j+dy]?.info==="mina"){
            ++minaNears;
          }
        }
      }
      cell.info = minaNears;
    }
  }
  
  return {board: tablero, isRunning:true};
}

const reducer = (tablero, action)=>{

    const { type, i, j } = action;
    console.log("i ->"+ i)
    console.log("j ->"+ j)
    if (type === "setVisible") {
      const newTablero = [...tablero.board];
      newTablero[i][j].visibility = true;

      if (newTablero[i][j].info === "mina") {
        return { board: newTablero, isRunning: false };
      }

      return { board: newTablero, isRunning: true };

    }else{
    if(type === "Generar"){
        const filas = parseInt(i);
        const columnas = parseInt(j);
        let {minas} = action;
        minas = parseInt(minas);
        if(filas > 0 && columnas > 0 && minas >0){
          const nuevoTablero = generarTablero({rows: columnas, columns: filas, minas: minas});
          return nuevoTablero;
        }else{
          return tablero;
        }
    }else{
      return tablero;
    }
  }
}

function App() {
  const [tablero, changeTablero] = useReducer(reducer, {board:[], isRunning: true}, () => generarTablero({rows:5, columns:5, minas:10}))
  const numCols = tablero.board[0].length;
  const filas = useRef(null);
  const columnas = useRef(null);
  const minas = useRef(null);

  return (
  <>
  <h1>Bienvenido al juego del buscaminas</h1>
  <section className="opciones">
  <input type="number" ref={filas} placeholder="Filas"/>
  <input type="number" ref={columnas} placeholder="Columnas"/>
  <input type="number" ref={minas} placeholder="Minas"/>
  <button onClick={() => changeTablero({type: "Generar", i: filas.current.value, j: columnas.current.value, minas:minas.current.value})}>Generar</button>
  </section>
 
  <div style={{display: "grid", gridTemplateColumns: `repeat(${numCols}, 1fr)`}} className="tablero">
      {tablero.board.map((row, i) => 
        row.map(({visibility, info}, j) => 
          <div onClick={() => tablero.isRunning?changeTablero({type: "setVisible", i,j}):() => {}}  key={`${i} ${j}`} className="celda">
            <p>{visibility? info ==="mina"? "🍗": info :"X"}</p></div>
    ))}
  </div>
  {tablero.isRunning?"":<div className="lose"><h2>Perdiste</h2>
                        <button onClick={() => changeTablero({type: "Generar", i: 5, j: 5, minas:10})}>Reiniciar</button></div>}
  </>
  );
}

export default App;
