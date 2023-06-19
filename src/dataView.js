import { CurrentView } from '@base/components/Calendar/Calendar.types';
import { TimeDateFormat } from '@base/components/Calendar/Calendar.constants';

const data = [
  {
    id: 2581,
    code: 'IM1241',
    licensePlate: 'IM124 1',
    vin: 'IM1241',
    stateOfCharge: 65,
    kilometers: 0,
    rentalState: 'AVAILABLE',
    serviceStateV2: 'MAINTENANCE',
    batteryLevel: ['HIGH', 'MEDIUM', 'TEST', 'OVERFLOW_TEST'],
    updatedAt: '2023-06-03T20:54:22.620702Z',
    branchId: 6,
    categoryId: 613,
    serviceStateV2LastModifiedAt: '2023-01-17T20:54:22.620702Z',
    lastOperationalAt: '2023-01-17T20:53:49.478244Z',
    lastOutOfOrderAt: '2023-01-17T20:54:22.620702Z',
    inactiveFor: 'PT-37H-32M-51.865826S',
    createdAt: '2023-06-01T10:05:06.628591Z',
    chargingState: 'UNKNOWN',
    powerState: 'UNKNOWN',
    openTasksCount: 1,
    hasOpenTasksForCurrentUser: false,
    offline: false,
    ioTBatteryLevel: 'UNKNOWN',
    helmets: 'NOT_APPLICABLE',
    available: false,
  },
  {
    id: 2416,
    code: 'TEST SOC MANDA1',
    licensePlate: 'Test soc manda 1',
    vin: 'TEST SOC MANDA1',
    stateOfCharge: 0,
    kilometers: 0,
    rentalState: 'AVAILABLE',
    serviceStateV2: 'FUNCTIONAL',
    batteryLevel: ['UNKNOWN', 'HIGH'],
    updatedAt: '2023-06-04T23:00:00Z',
    branchId: 1,
    categoryId: 351,
    createdAt: '2023-06-01T10:05:06.628591Z',
    chargingState: 'UNKNOWN',
    powerState: 'UNKNOWN',
    openTasksCount: 0,
    annotations: [
      {
        type: 'Tag',
        id: 4718,
        name: 'sd123',
      },
      {
        type: 'Tag',
        id: 923,
        name: 'ss',
      },
    ],
    hasOpenTasksForCurrentUser: false,
    offline: false,
    helmets: 'NOT_APPLICABLE',
    available: false,
  },
  {
    id: 3416,
    code: 'TEST SOC MANDA1',
    licensePlate: 'Test soc manda 1',
    vin: 'TEST SOC MANDA1',
    stateOfCharge: 0,
    kilometers: 0,
    rentalState: 'AVAILABLE',
    serviceStateV2: 'FUNCTIONAL',
    batteryLevel: ['UNKNOWN', 'HIGH'],
    updatedAt: '2023-06-03T23:00:00Z',
    branchId: 1,
    categoryId: 351,
    createdAt: '2023-06-03T10:05:06.628591Z',
    chargingState: 'UNKNOWN',
    powerState: 'UNKNOWN',
    openTasksCount: 0,
    annotations: [
      {
        type: 'Tag',
        id: 4718,
        name: 'sd123',
      },
      {
        type: 'Tag',
        id: 923,
        name: 'ss',
      },
    ],
    hasOpenTasksForCurrentUser: false,
    offline: false,
    helmets: 'NOT_APPLICABLE',
    available: false,
  },
];

const colorDots = [
  {
    color: 'blue',
    text: 'Text about blue color',
    date: '2023-06-02',
  },
  {
    color: 'red',
    text: 'Text about red color',
    date: '2023-06-03',
  },
  {
    color: 'green',
    text: 'Text about green color',
    date: '2023-06-04',
  },
  {
    color: 'green',
    text: 'Text about green color',
    date: '2023-06-05',
  },
];

const dataViewConfig = (currentDate, setCurrentDate) => ({
  data: data,
  currentDate,
  setCurrentDate,
  onItemClick: () => {
    (() => [1, 2].map())();
  },
  currentView: CurrentView.MONTH,
  onlyOneOnPlace: false,
  availableTimeDate: [
    {
      isIntervalTimeDate: false,
      propertyIdentifier: 'updatedAt',
      label: 'Updated at',
    },
    {
      isIntervalTimeDate: false,
      propertyIdentifier: 'serviceStateV2LastModifiedAt',
      label: 'Service state last modified at',
    },
    {
      isIntervalTimeDate: false,
      propertyIdentifier: 'createdAt',
      label: 'Created at',
    },
    {
      isIntervalTimeDate: false,
      propertyIdentifier: 'lastOperationalAt',
      label: 'Last operational at',
    },
    {
      isIntervalTimeDate: false,
      propertyIdentifier: 'lastOutOfOrderAt',
      label: 'last out of order at',
    },
    {
      isIntervalTimeDate: true,
      propertyIdentifier: 'createdAt-updatedAt',
      label: 'Created at - updated at',
    },
  ],
  activeTimeDateField: 'createdAt-updatedAt',
  colorDots,
  availableProperties: Object.keys(data[0]).reduce((properties, key) => {
    switch (key) {
      case 'updatedAt':
      case 'serviceStateV2LastModifiedAt':
      case 'createdAt':
      case 'lastOperationalAt':
      case 'lastOutOfOrderAt':
        properties[key] = {
          dataType: {
            type: 'DATE',
            format: TimeDateFormat.DISPLAY_DATE_TIME,
          },
        };
        break;
      case 'id':
        properties[key] = {
          prefix: 'ID: ',
        };
        break;
      case 'batteryLevel':
        properties[key] = {
          dataType: {
            type: 'TAG',
            style: 'squared',
            transformValue: (originalValue) => `:${originalValue}:`,
          },
        };
        break;
      case 'stateOfCharge':
        properties[key] = {
          dataType: {
            type: 'TEXT',
            transformValue: (originalValue) => `${originalValue}%`,
          },
        };
        break;
      case 'chargingState':
        properties[key] = {
          dataType: {
            type: 'TEXT',
            transformValue: (originalValue) =>
              originalValue === 'UNKNOWN' ? '--' : originalValue,
          },
        };
        break;
      case 'rentalState':
        properties[key] = {
          dataType: {
            type: 'INDICATION',
            indicatorColors: {
              AVAILABLE: '#3FFCB1',
              OUT_OF_BUSINESS: '#ACC333',
            },
          },
        };
        break;
      default:
        properties[key] = true;
    }

    return properties;
  }, {}),
  selectedProperties: [
    'id',
    'updatedAt',
    'batteryLevel',
    'inactiveFor',
    'rentalState',
    'powerState',
    'chargingState',
    'stateOfCharge',
  ],
});

export default dataViewConfig;
