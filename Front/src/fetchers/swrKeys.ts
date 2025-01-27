const auth = 'https://easyrent-t7he.onrender.com/api/auth/';
const home = 'https://easyrent-t7he.onrender.com/api/home/';
const profile = 'https://easyrent-t7he.onrender.com/api/profile/';
const wallet = 'https://easyrent-t7he.onrender.com/api/wallet/';
// const auth = "http://127.0.0.1:8000/api/auth/";
// const home = "http://127.0.0.1:8000/api/home/"
// const profile = "http://127.0.0.1:8000/api/profile/";
// const wallet = "http://127.0.0.1:8000/api/wallet/"

export const swrKeys = {
    registerUser: `${auth}register-user/`,
    registerCompany: `${auth}register-company/`,
    logIn: `${auth}login/`,
    search: (queryString: string = ''): string =>
        `${home}search?${queryString}&limit=198&page=1`, // search sa tipovima
    userinfo: `${auth}user-info/`,
    logout: `${auth}logout/`,
    profileUser: `${profile}user/info/`,
    deleteUser: `${profile}user/delete/`,
    userPass: `${profile}user/pass/`,
    userRentals: `${profile}user/rentals/`,
    addBalance: (amount: number) => `${wallet}addMoney/${amount}/`,
    buyGems: `${wallet}buyGems/`,
    rentOffer: (offer_id: string) => `${wallet}rentOffer/${offer_id}/`,
    checkTransaction: (trans_id: string) =>
        `${wallet}checkTransaction/${trans_id}/`,
    getBalance: `${wallet}getBalance/`,
    cities: `${home}cities/`,
    companies: `${home}showcased-companies/?limit=6`,
    bestValue: `${home}best-value/?limit=10&page=1`,
    mostPopular: `${home}most-popular/?limit=10&page=1`,
    allLocations: `${home}locations`,
    offer: (queryString: string = ''): string => `${home}offer/${queryString}/`,
    offerLocations: (queryString: string = ''): string =>
        `${home}offer-locations/${queryString}/`,
    reviews: (queryString: string = ''): string =>
        `${home}reviews/${queryString}/?limit=16&page=1`,
    carModels: `${home}models/`,
    addReview: (id: string) => `${profile}user/leave-review/${id}/`,
    unavailable_pick_up: (offer_id: string, location_id: string) =>
        `${home}unavailable-pick-up/${offer_id}/?pickUpLocationId=${location_id}`,
    available_drop_off: (
        offer_id: string,
        pickUpLocationId: string,
        pickUpDate: string,
        pickUpTime: string,
        dropOffLocationId: string
    ) =>
        `${home}available-drop-off/${offer_id}/?dropOffLocationId=${dropOffLocationId}&pickUpDate=${pickUpDate}&pickUpLocationId=${pickUpLocationId}&pickUpTime=${pickUpTime}`,

    companyInfo: `${profile}company/info`,
    companySetPass: `${profile}company/pass`,
    companySetHQ: `${profile}company/setHQ/`, // + locationid
    companyLocations: `${profile}company/locations`,
    companyLocationInfo: `${profile}company/location/`, // + locationId
    companyVehicles: `${profile}company/vehicles`,
    companyOffers: `${profile}company/offers`,
    companyVehicleVisi: `${profile}company/toggle-vehicle-visibility/`, // + vehicleId
    companyVehicleDelete: `${profile}company/vehicles/edit-vehicle/`, // + vehicleId
    companyOfferVisi: `${profile}company/toggle-offer-visibility/`, // + offerId
    companyOfferDelete: `${profile}company/offer/`, // + offerId
    companyLogsComplete: `${profile}company/log/completed`,
    companyLogsOngoing: `${profile}company/log/ongoing`,
    companyLogsUpcoming: `${profile}company/log/upcoming`,
    companyReviews: `${profile}company/reviews`,
    companyEarnings: `${profile}company/earnings`,
    companyVehicleLog: `${profile}company/vehicle-log/`, // + vehicleId
    companyVehicleLogCompleted: `${profile}company/log-completed/`, // + vehicleId
    companyVehicleLogUpcoming: `${profile}company/log-upcoming/`, // + vehicleId
    companyVehicleReviews: `${profile}company/log-reviews/`, // + vehicleId








};
