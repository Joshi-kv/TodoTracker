$(document).ready(() =>{
    $('#taskForm').submit((e)=>{
        e.preventDefault()
        console.log($('select[name ="status"]').val())
    })
})