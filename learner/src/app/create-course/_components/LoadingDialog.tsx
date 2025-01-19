import React from 'react'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
  } from "@/components/ui/alert-dialog"
import Image from 'next/image'
  

const LoadingDialog = ({loading}:any) => {
  return (
    <div>
        <AlertDialog open={loading}>
 
        <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogDescription>
                    <div className='flex flex-col items-center py-10'>
                    <Image src="/loading.gif" alt="loading" width={100} height={100} />
                    <h2>Please wait... Your course is creating </h2>
                    </div>
                </AlertDialogDescription>
            </AlertDialogHeader>
        </AlertDialogContent>
    </AlertDialog>

    </div>
  )
}

export default LoadingDialog

