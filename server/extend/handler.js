import F from "../../utils/tools/file";

export function success(ctx) {
  return (
    ctx.body = {
      success: true
    }
  )
}

export function data(ctx,data,total) {
  return (
    ctx.body = {
      success: true,
      data,
      total
    }
  )
}

export function error(ctx,error) {
  console.error(error)
  return (
    ctx.body = {
      success: false,
      message:error.message
    }
  )
}

export function message(ctx,message) {
  console.error(error)
  return (
    ctx.body = {
      success: false,
      message
    }
  )
}

export function filePath(ctx,uri) {
  let file = ctx.request.files.file

  let fileName,filePath
  if(file.length > 0){
    filePath = []
    for(let f of file){
      fileName = F.getFileName(f.path)
      let fPath = `/uploads${uri}/${fileName}`
      filePath.push({name:f.name,url:fPath})
    }

    return (
      ctx.body = {
        success: true,
        data:filePath
      }
    )
  }else {
    fileName = F.getFileName(file.path)
    filePath = `/uploads${uri}/${fileName}`

    return (
      ctx.body = {
        success: true,
        data:{
          name:file.name,
          url:filePath
        }
      }
    )
  }
}




