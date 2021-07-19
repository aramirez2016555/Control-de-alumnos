"use strict"

//IMPORTACIONES
var Cursos= require("../modelos/Cursos.model.js");
var jwt = require("../servicios/jwt");
const { find } = require("../modelos/Cursos.model.js");
const usuarioModel = require("../modelos/Cursos.model.js");
const CursosModel = require("../modelos/Cursos.model.js");






function ingresarCursos(req, res){

var CursosModel = Cursos();

var params = req.body;

if(req.user.rol === "ROL_ALUMNO"  ){
    return res.status(500).send({mensaje:"Solo los profesores pueden crear el curso"})

}else{
if(params.Nombre ){
 
      //modelo base de datos   datos del formulario
    
      CursosModel.Profesor = req.user.sub;

      CursosModel.Nombre = params.Nombre;
      Cursos.find({ Nombre: CursosModel.Nombre})

          
      .exec((err, CursosEncontrados)=>{

           if(err) return res.status(500).send({mensaje: "error en la peticion de Cursos"});
     
           if(CursosEncontrados && CursosEncontrados.length >= 1){

           return res.status(500).send({mensaje: "El Curso ya existe "});
 
           }else{
                     CursosModel.save((err, CursoGuardado) => {
                         if(err) return res.status(500).send({mensaje : "Error en la peticion Empleado"});

                          if(CursoGuardado){
                               res.status(200).send({CursoGuardado})

                          }else{
                           res.status(404).send({mensaje:"No se a podido guardar el Usuario"})
 

                        }
                     
                     })     
             
                

           }
      
      })



  
                        
                    

               }
          }
}
   

function IngresarCurso(req, res) {
     var CursosModel = Cursos();

//esto lo pido del body
var params = req.body;

//Aquí se verifica que sea una empresa
if(req.user.rol === "ROL_MAESTRO"  ){
    return res.status(500).send({mensaje:"Solo los alumnos pueden unirse a un curso"})

}else{
//Sin esto datos en el body no hay empleados
if( params.Nombre ){
 
      //modelo base de datos   datos del formulario
      


      CursosModel.Nombre = params.Nombre;
      CursosModel.alumno = req.user.sub;

      Cursos.find({alumno : CursosModel.alumno, Nombre:CursosModel.Nombre }).exec((err, CursosR)=>{
          if(err) 
               return res.status(500).send({mensaje:"Error en la peticion obtener unir"});

          if(!CursosR)
               return res.status(500).send({mensaje:" No tienes datos "}); 

          


               if(CursosR && CursosR.length >= 1){

                    return res.status(500).send({mensaje: "ya esta en el curso "});
          
                    }else{
                         Cursos.find({alumno : CursosModel.alumno}).exec((err, CursosM)=>{
                                             if(err) 
                                             return res.status(500).send({mensaje:"Error en la peticion obtener unir"});
                              
                                             if(!CursosM)
                                             return res.status(500).send({mensaje:" No tienes datos "}); 

                                             if(CursosM && CursosM.length >2){
                                                   
                                                  return res.status(500).send({mensaje:"Limite de cantidad de cursos alcanzado"})
                                             }else{

                                                  Cursos.findOne(  {Nombre : CursosModel.Nombre  }, `Profesor` )
                                                  
                                                  
                                                  
                                                  .exec((err, CursosRel)=>{
                                                       if(err) 
                                                       return res.status(500).send({mensaje:"Error en la peticion obtener unir"});

                                                       if(!CursosRel)
                                                       return res.status(500).send({mensaje:" No tienes datos "}); 


                                                  CursosModel.Profesor = CursosRel.Profesor;
                                                  CursosModel.CursoMaestroid = CursosRel._id
                                                  CursosModel.save((err, CursoGuardado) => {
                                                       if(err) return res.status(500).send({mensaje : "Error en la peticion Empleado"});
                              
                                                        if(CursoGuardado){
                                                             res.status(200).send({CursoGuardado})
                              
                                                        }else{
                                                         res.status(404).send({mensaje:"No se a podido guardar el Usuario"})
                               
                              
                                                      }
                                                   
                                                   })   

                                                  })


                                             }
                         
                         
                              })

                    }

                      
                         
         
                    })
          
                         




     }else{
          return res.status(500).send({mensaje:"No envio los parametro suficientes o envio de mas"})
          
     }
     
}
}





function obtenerCursos(req, res){

    if(req.user.rol != "ROL_MAESTRO"  ){
    
    //2
     Cursos.find({alumno : req.user.sub}).exec((err, Cursos)=>{
          if(err) 
               return res.status(500).send({mensaje:"Error en la peticion obtener Cursos"});

          if(!Cursos)
               return res.status(500).send({mensaje:"Error en la consulta de Usuarios o No tienes datos "}); 

          return res.status(200).send({Cursos});
          

     })


    }else{
    //1
        Cursos.find({alumno: null , Profesor: req.user.sub  }).exec((err, Cursos)=>{
            if(err) 
                 return res.status(500).send({mensaje:"Error en la peticion obtener Empleados"});
  
            if(!Cursos)
                 return res.status(500).send({mensaje:"Error en la consulta de Usuarios o No tienes datos "}); 
  
            return res.status(200).send((Cursos));

    })

}

}


//por id



function editarCurso(req, res)
{
          var iDCurso= req.params.id;
          var params = req.body;


     //borrar la propiedad password

     delete params.password;

     //SE VERIFICA QUE NO SE CREAN ADMINS!
     if(req.user.rol != "ROL_MAESTRO")

          return res.status(500).send({mensaje :"Solo los profesores pueden modific"})

          


     Cursos.findOne({ _id:iDCurso,alumno:null  }).exec((err, CursosB)=>{
               if(err) 
                         return res.status(500).send({mensaje:"Error en la peticion obtener Empleados"});

               if(!CursosB)
                         return res.status(500).send({mensaje:"Error en la consulta de Usuarios o No tienes datos "}); 


                         
               if(CursosB.Profesor != req.user.sub )
               
                    return res.status(500).send({mensaje:"No se puede Modificar un curso ageno"});

               
               Cursos.update({CursoMaestroid:iDCurso},{$set:{Nombre:params.Nombre}},{multi:true}).exec((err, Cursoactualizado)=>{
                         if(err) return res.status(500).send({mensaje:"Error en la peticion"})
                         if(!Cursoactualizado) return res.status(500).send({mensaje:"No se ha podido editat el usuario"});
                         
               
               
                                   if(Cursoactualizado){
                         
                                        Cursos.findByIdAndUpdate(iDCurso, params, {new:true},(err, Cursoactualizado)=>{
                                             if(err) return res.status(500).send({mensaje:"Error en la peticion"})
                                             if(!Cursoactualizado) return res.status(500).send({mensaje:"No se ha podido editat el usuario"});
                                                  


                                             if(Cursoactualizado){
                                                  
                                                  return res.status(200).send({Cursoactualizado});
                                                  
                                             
                                             }
                                        })

                                   }


                    })

     })


}


function EliminarCurso(req, res)
{
     var iDCurso= req.params.id;



     //SE VERIFICA QUE NO SE CREAN Profes!
     if(req.user.rol != "ROL_MAESTRO")

               return res.status(500).send({mensaje :"Solo los profesores pueden Eliminar Cursos"})

     


     Cursos.findOne({ _id:iDCurso,alumno:null  }).exec((err, CursosB)=>{
                    if(err) 
                         return res.status(500).send({mensaje:"Error en la peticion delete Cursos"});

                    if(!CursosB)
                         return res.status(500).send({mensaje:"Error en la consulta de Eliminar Cursos o No tienes datos "}); 


                         
               if(CursosB.Profesor != req.user.sub )
               
                    return res.status(500).send({mensaje:"No se puede Eliminar un curso ageno"});

               
               Cursos.update({CursoMaestroid:iDCurso},{$set:{Nombre: "defult(Curso Maestro Eliminado)"}  },{multi:true}).exec((err, Cursoactualizado)=>{
                                   if(err) return res.status(500).send({mensaje:"Error en la peticion"})
                                   if(!Cursoactualizado) return res.status(500).send({mensaje:"No se ha podido eliminar CUrsos"});
                                   
                         
                         
                         if(Cursoactualizado){
                                   
                              Cursos.findByIdAndDelete(iDCurso,(err, CursoEliminado)=>{
                                   if(err) return res.status(500).send({mensaje:"Error en la peticion"})
                                   if(!Cursoactualizado) return res.status(500).send({mensaje:"No se ha podido eliminar el Curso"});
                                        


                                   if(Cursoactualizado){
                                        
                                        return res.status(200).send({CursoEliminado});
                                        
                                   
                                   }



                              })

                                   
                              
                         }





                    })
                    

               







     })

     
     

}










module.exports = {    ingresarCursos, 
     editarCurso, 
     obtenerCursos,
     IngresarCurso,EliminarCurso } 