// Your JS Script here


function readInput(){
    const text = document.getElementById("texto").value;
    if(!text){
        alert("Nenhum texto lido")
    }
    else{
        document.getElementById("visuInput").innerText = text
    }
}
