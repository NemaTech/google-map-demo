let map;
let currLocationSelected;
let currLocationSelectedIdx;
let locationSelected = []

const localtions = [
    {
        id: "1",
        lat: 48.931965,
        lng: 2.377932,
        type: "rdv",
        address: "61 Rte de la Courneuve Saint-Denis, Île-de-France",
    },
    {
        id: "2",
        lat: 48.931965,
        lng: 2.377932,
        type: "window",
        address: "62 Rte de la Courneuve Saint-Denis, Île-de-France",
    },
    {
        id: "3",
        lat: 48.931965,
        lng: 2.377932,
        type: "window",
        address: "63 Rte de la Courneuve Saint-Denis, Île-de-France",
    },
    {
        id: "4",
        lat: 48.849346,
        lng: 2.46857,
        type: "window",
        address: "6 Rue Albert 1erFontenay-sous-Bois, Île-de-France",
    },
    {
        id: "5",
        lat: 48.814994,
        lng: 2.223437,
        type: "window",
        address: "87 Rte des Gardes Meudon, Île-de-France",
    },
    {
        id: "6",
        lat: 48.870379,
        lng: 2.341891,
        type: "rdv",
        address: "3 Rue Saint-Marc Paris, Île-de-France",
    },
    {
        id: "7",
        lat: 48.806552,
        lng: 2.488737,
        type: "rdv",
        address: "13 Av. des Sapins Saint-Maur-des-Fossés, Île-de-France",
    },
    {
        id: "8",
        lat: 48.862743,
        lng: 2.203023,
        type: "none",
        address: "92 Av. du Président Wilson Suresnes, Île-de-France",
    },
]

const initMap = () => {
    // set up the map
    map = new google.maps.Map(document.getElementById("map"), {
        center: new google.maps.LatLng(0, 0),
        zoom: 4,
    });

    setMapStyle(map);

    const bounds = new google.maps.LatLngBounds();
    let existsLocaltions = [];

    localtions.forEach((lc, idx) => {
        // render list location
        renderLocation(lc)

        if (!existsLocaltions.filter((elc) => elc.lat == lc.lat && elc.lng == lc.lng).length) {
            existsLocaltions.push(lc);
            let markerObj = {
                position: { lat: lc.lat, lng: lc.lng },
                map
            };
            if (getLocationSelected(lc).length > 1) {
                Object.assign(markerObj, {
                label: {
                    text: `${getLocationSelected(lc).length}`,
                    color: '#ffffff',
                    fontSize: '11px'
                }
                });
            }

            const marker = new google.maps.Marker(markerObj);
            marker.addListener('click', () => {
                getLocationDetail(lc)
            });
            let marker_pos = marker.getPosition();
            bounds.extend(marker_pos);
            return marker;
        }
    });

    map.fitBounds(bounds);

    let mapTimeOut;
    map.addListener('bounds_changed', () => {
        clearTimeout(mapTimeOut);
        mapTimeOut = setTimeout(() => {
        console.log(map.getBounds());
        }, 1000);
    });
}

const renderLocation = (location) => {
    let node = document.getElementById("location-template").cloneNode(true)
    node.removeAttribute("id")
    node.classList.remove("hidden")
    node.querySelector("#address").innerHTML = location.address
    node.addEventListener("click", function () {
        getLocationDetail(location)
    })
    document.getElementById("list-location").append(node)
}

const setMapStyle = (map) => {
    map.setOptions({
        mapTypeControl: false,
        zoomControlOptions: {
            position: google.maps.ControlPosition.TOP_RIGHT
        },
        styles: [
            {
            elementType: 'geometry',
            stylers: [{ color: '#f5f5f5' }]
            },
            {
            elementType: 'labels.icon',
            stylers: [{ visibility: 'off' }]
            },
            {
            elementType: 'labels.text.fill',
            stylers: [{ color: '#616161' }]
            },
            {
            elementType: 'labels.text.stroke',
            stylers: [{ color: '#f5f5f5' }]
            },
            {
            featureType: 'administrative.land_parcel',
            elementType: 'labels.text.fill',
            stylers: [{ color: '#bdbdbd' }]
            },
            {
            featureType: 'poi',
            elementType: 'geometry',
            stylers: [{ color: '#eeeeee' }]
            },
            {
            featureType: 'poi',
            elementType: 'labels.text.fill',
            stylers: [{ color: '#757575' }]
            },
            {
            featureType: 'poi.park',
            elementType: 'geometry',
            stylers: [{ color: '#e5e5e5' }]
            },
            {
            featureType: 'poi.park',
            elementType: 'labels.text.fill',
            stylers: [{ color: '#9e9e9e' }]
            },
            {
            featureType: 'road',
            elementType: 'geometry',
            stylers: [{ color: '#ffffff' }]
            },
            {
            featureType: 'road.arterial',
            elementType: 'labels.text.fill',
            stylers: [{ color: '#757575' }]
            },
            {
            featureType: 'road.highway',
            elementType: 'geometry',
            stylers: [{ color: '#dadada' }]
            },
            {
            featureType: 'road.highway',
            elementType: 'labels.text.fill',
            stylers: [{ color: '#616161' }]
            },
            {
            featureType: 'road.local',
            elementType: 'labels.text.fill',
            stylers: [{ color: '#9e9e9e' }]
            },
            {
            featureType: 'transit.line',
            elementType: 'geometry',
            stylers: [{ color: '#e5e5e5' }]
            },
            {
            featureType: 'transit.station',
            elementType: 'geometry',
            stylers: [{ color: '#eeeeee' }]
            },
            {
            featureType: 'water',
            elementType: 'geometry',
            stylers: [{ color: '#c9c9c9' }]
            },
            {
            featureType: 'water',
            elementType: 'labels.text.fill',
            stylers: [{ color: '#9e9e9e' }]
            }
        ]
    });
}

const getLocationSelected = (location) => {
    return [location].concat(
        localtions.filter((l) => l.lat == location.lat && l.lng == location.lng && l.id != location.id)
    )
}

const getLocationDetail = (location) => {
    currLocationSelected = location
    currLocationSelectedIdx = 1
    locationSelected = getLocationSelected(location)
    showLocationDetail()
}

const showStreetView = () => {
    let panorama = map.getStreetView()
    panorama.setVisible(false)
    panorama.setPosition({ lat: currLocationSelected.lat, lng: currLocationSelected.lng })
    panorama.setPov({
        heading: 265,
        pitch: 0,
    })
    panorama.setVisible(true)
}

const backApartment = () => {
    if (currLocationSelectedIdx > 1) {
        currLocationSelectedIdx--
        currLocationSelected = locationSelected[currLocationSelectedIdx - 1]
        showLocationDetail()
    }
}

const nextApartment = () => {
    console.log()
    if (currLocationSelectedIdx < locationSelected.length) {
        currLocationSelectedIdx++
        currLocationSelected = locationSelected[currLocationSelectedIdx - 1]
        showLocationDetail()
    }
}

const showLocationDetail = () => {
    let locationDetailElm = document.getElementById("location-detail")
    locationDetailElm.classList.remove("hidden")
    locationDetailElm.querySelector("#address").innerHTML = currLocationSelected.address
    
    let apartmentAmountElm = locationDetailElm.querySelector("#apartment-amount")
    if (locationSelected.length > 1) {
        apartmentAmountElm.classList.remove("hidden")
        apartmentAmountElm.querySelector("#amount").innerHTML = locationSelected.length + ' biens à cette adresse'
        apartmentAmountElm.querySelector("#current-apartment-idx").innerHTML = currLocationSelectedIdx
    } else {
        apartmentAmountElm.classList.add("hidden")
    }
}


// ----------- init map --------------
window.initMap = initMap;