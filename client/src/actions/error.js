export const setError = (err) => {
return {
type:"SET_ERROR",
payload:err
}
}

export const clearError = () => {
return {
type:"CLEAR_ERROR"
}
}
