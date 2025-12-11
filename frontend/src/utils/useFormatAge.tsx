const useFormatAge = (dateOfBirth: Date) => {
    const now = new Date();
    const age = now.getFullYear() - dateOfBirth.getFullYear();
    const m = now.getMonth() - dateOfBirth.getMonth();
    if (m < 0 || (m === 0 && now.getDate() < dateOfBirth.getDate())) {
        return age - 1;
    }
    return age;
};
export default useFormatAge;