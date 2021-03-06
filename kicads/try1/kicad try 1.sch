EESchema Schematic File Version 2
LIBS:kicad try 1-rescue
LIBS:power
LIBS:device
LIBS:transistors
LIBS:conn
LIBS:linear
LIBS:regul
LIBS:74xx
LIBS:cmos4000
LIBS:adc-dac
LIBS:memory
LIBS:xilinx
LIBS:microcontrollers
LIBS:dsp
LIBS:microchip
LIBS:analog_switches
LIBS:motorola
LIBS:texas
LIBS:intel
LIBS:audio
LIBS:interface
LIBS:digital-audio
LIBS:philips
LIBS:display
LIBS:cypress
LIBS:siliconi
LIBS:opto
LIBS:atmel
LIBS:contrib
LIBS:valves
LIBS:button_pad_silicon_2x2
LIBS:4067 for 24-Pin SSOP
LIBS:ArduProMiniTKB
LIBS:Sparkfun-silicon-buttons-pad
LIBS:kicad try 1-cache
EELAYER 25 0
EELAYER END
$Descr A3 11693 16535 portrait
encoding utf-8
Sheet 1 1
Title ""
Date "sam. 04 avril 2015"
Rev ""
Comp ""
Comment1 ""
Comment2 ""
Comment3 ""
Comment4 ""
$EndDescr
$Comp
L SW_PUSH SW1
U 1 1 582B987C
P 8250 10350
F 0 "SW1" H 8400 10460 50  0000 C CNN
F 1 "SW_PUSH" H 8250 10270 50  0000 C CNN
F 2 "Buttons_Switches_ThroughHole:SW_PUSH_6mm" H 8250 10350 50  0001 C CNN
F 3 "" H 8250 10350 50  0000 C CNN
	1    8250 10350
	1    0    0    -1  
$EndComp
$Comp
L SW_PUSH SW2
U 1 1 582B9BF5
P 8250 10650
F 0 "SW2" H 8400 10760 50  0000 C CNN
F 1 "SW_PUSH" H 8250 10570 50  0000 C CNN
F 2 "Buttons_Switches_ThroughHole:SW_PUSH_6mm" H 8250 10650 50  0001 C CNN
F 3 "" H 8250 10650 50  0000 C CNN
	1    8250 10650
	1    0    0    -1  
$EndComp
$Comp
L SW_PUSH SW3
U 1 1 582B9CDF
P 8250 10950
F 0 "SW3" H 8400 11060 50  0000 C CNN
F 1 "SW_PUSH" H 8250 10870 50  0000 C CNN
F 2 "Buttons_Switches_ThroughHole:SW_PUSH_6mm" H 8250 10950 50  0001 C CNN
F 3 "" H 8250 10950 50  0000 C CNN
	1    8250 10950
	1    0    0    -1  
$EndComp
$Comp
L SW_PUSH SW4
U 1 1 582B9DCC
P 8250 11250
F 0 "SW4" H 8400 11360 50  0000 C CNN
F 1 "SW_PUSH" H 8250 11170 50  0000 C CNN
F 2 "Buttons_Switches_ThroughHole:SW_PUSH_6mm" H 8250 11250 50  0001 C CNN
F 3 "" H 8250 11250 50  0000 C CNN
	1    8250 11250
	1    0    0    -1  
$EndComp
$Comp
L CD74HCT4067 U2
U 1 1 582B4D2F
P 3000 1700
F 0 "U2" H 3250 2550 50  0000 C CNN
F 1 "CD74HCT4067" H 3300 800 50  0000 C CNN
F 2 "SparkFun-DigitalIC:TSSOP-24" H 3000 1700 60  0001 C CNN
F 3 "" H 3000 1700 60  0001 C CNN
	1    3000 1700
	0    1    1    0   
$EndComp
$Comp
L CD74HCT4067 U3
U 1 1 582B6075
P 7650 7500
F 0 "U3" H 7900 8350 50  0000 C CNN
F 1 "CD74HCT4067" H 7950 6600 50  0000 C CNN
F 2 "SparkFun-DigitalIC:TSSOP-24" H 7650 7500 60  0001 C CNN
F 3 "" H 7650 7500 60  0001 C CNN
	1    7650 7500
	-1   0    0    1   
$EndComp
Text Label 8300 8800 0    60   ~ 0
VCC
$Comp
L GNDREF #PWR01
U 1 1 582C244B
P 8250 7850
F 0 "#PWR01" H 8250 7600 50  0001 C CNN
F 1 "GNDREF" H 8250 7700 50  0000 C CNN
F 2 "" H 8250 7850 50  0000 C CNN
F 3 "" H 8250 7850 50  0000 C CNN
	1    8250 7850
	1    0    0    -1  
$EndComp
Text Label 8900 6950 0    60   ~ 0
A0
Text Label 8250 7350 0    60   ~ 0
PD7
Text Label 8250 7450 0    60   ~ 0
PD6
Text Label 8250 7550 0    60   ~ 0
PD5
Text Label 8250 7650 0    60   ~ 0
PD4
$Comp
L GNDREF #PWR02
U 1 1 582CCF28
P 3350 1100
F 0 "#PWR02" H 3350 850 50  0001 C CNN
F 1 "GNDREF" H 3350 950 50  0000 C CNN
F 2 "" H 3350 1100 50  0000 C CNN
F 3 "" H 3350 1100 50  0000 C CNN
	1    3350 1100
	-1   0    0    1   
$EndComp
Text Label 4100 1700 0    60   ~ 0
VCC
Text Label 3150 1100 1    60   ~ 0
PD0
Text Label 3050 1100 1    60   ~ 0
PD1
Text Label 2950 1100 1    60   ~ 0
PD2
Text Label 2850 1100 1    60   ~ 0
PD3
Text Label 9650 7000 2    60   ~ 0
PD0
Text Label 9650 6900 2    60   ~ 0
PD1
Text Label 9650 7300 2    60   ~ 0
PD2
Text Label 9650 7400 2    60   ~ 0
PD3
$Comp
L ARDUPROMINI-6 uP1
U 1 1 582D5713
P 10850 5800
F 0 "uP1" H 10200 4850 60  0000 C CNN
F 1 "ARDUPROMINI-6" H 10250 5000 60  0000 C CNN
F 2 "ArduProMiniTKB:ArduProMini-6" H 10850 5800 60  0001 C CNN
F 3 "" H 10850 5800 60  0000 C CNN
	1    10850 5800
	1    0    0    -1  
$EndComp
$Comp
L parkFun-BUTTONPAD16-RESCUE-kicad_try_1 PAD-matrix-1
U 1 1 582DAE3C
P 2450 5850
F 0 "PAD-matrix-1" H 1950 6450 50  0000 C CNN
F 1 "BP3" H 2350 5500 50  0000 C CNN
F 2 "button-pad-autotel:2x2-buttonpad-sparkfun-autotel" H 2450 5850 50  0001 C CNN
F 3 "" H 2450 5850 50  0000 C CNN
	1    2450 5850
	1    0    0    -1  
$EndComp
Text Label 2450 850  1    60   ~ 0
A1
Text Label 3750 2300 3    60   ~ 0
MUXAS0
Text Label 3650 2300 3    60   ~ 0
MUXAS1
Text Label 3550 2300 3    60   ~ 0
MUXAS2
Text Label 3450 2300 3    60   ~ 0
MUXAS3
Text Label 3350 2300 3    60   ~ 0
MUXAB4
Text Label 3250 2300 3    60   ~ 0
MUXAB5
Text Label 3150 2300 3    60   ~ 0
MUXAB6
Text Label 3050 2300 3    60   ~ 0
MUXAB7
Text Label 2950 2300 3    60   ~ 0
MUXAG8
Text Label 2850 2300 3    60   ~ 0
MUXAG9
Text Label 2750 2300 3    60   ~ 0
MUXAG10
Text Label 2650 2300 3    60   ~ 0
MUXAG11
Text Label 2550 2300 3    60   ~ 0
MUXAR12
Text Label 2450 2300 3    60   ~ 0
MUXAR13
Text Label 2350 2300 3    60   ~ 0
MUXAR14
Text Label 2250 2300 3    60   ~ 0
MUXAR15
Text Label 5750 10350 1    60   ~ 0
MUXAS0
Text Label 4700 10350 1    60   ~ 0
MUXAS1
Text Label 3650 10350 1    60   ~ 0
MUXAS2
Text Label 2600 10350 1    60   ~ 0
MUXAS3
Text Label 5650 10350 1    60   ~ 0
MUXAB4
Text Label 4600 10350 1    60   ~ 0
MUXAB5
Text Label 3550 10350 1    60   ~ 0
MUXAB6
Text Label 2500 10350 1    60   ~ 0
MUXAB7
Text Label 5550 10350 1    60   ~ 0
MUXAG8
Text Label 4500 10350 1    60   ~ 0
MUXAG9
Text Label 3450 10350 1    60   ~ 0
MUXAG10
Text Label 2400 10350 1    60   ~ 0
MUXAG11
Text Label 2300 10350 1    60   ~ 0
MUXAR15
Text Label 3350 10350 1    60   ~ 0
MUXAR14
Text Label 4400 10350 1    60   ~ 0
MUXAR13
Text Label 5450 10350 1    60   ~ 0
MUXAR12
Text Label 5050 11850 0    60   ~ 0
MUXBS3
Text Label 8550 10350 0    60   ~ 0
MUXBS4
Text Label 8550 10650 0    60   ~ 0
MUXBS5
Text Label 8550 10950 0    60   ~ 0
MUXBS6
Text Label 8550 11250 0    60   ~ 0
MUXBS7
Text Label 4950 12000 0    60   ~ 0
MUXBG11
Text Label 7050 8250 2    60   ~ 0
MUXBS0
Text Label 7050 8150 2    60   ~ 0
MUXBS1
Text Label 7050 8050 2    60   ~ 0
MUXBS2
Text Label 7050 7950 2    60   ~ 0
MUXBS3
Text Label 7050 7850 2    60   ~ 0
MUXBS4
Text Label 7050 7750 2    60   ~ 0
MUXBS5
Text Label 7050 7650 2    60   ~ 0
MUXBS6
Text Label 7050 7550 2    60   ~ 0
MUXBS7
$Comp
L R R2
U 1 1 582D1004
P 8250 6800
F 0 "R2" V 8330 6800 50  0000 C CNN
F 1 "R" V 8250 6800 50  0000 C CNN
F 2 "Resistors_ThroughHole:Resistor_Horizontal_RM10mm" V 8180 6800 50  0001 C CNN
F 3 "" H 8250 6800 50  0000 C CNN
	1    8250 6800
	1    0    0    -1  
$EndComp
$Comp
L GNDREF #PWR03
U 1 1 582D153D
P 8250 6650
F 0 "#PWR03" H 8250 6400 50  0001 C CNN
F 1 "GNDREF" H 8250 6500 50  0000 C CNN
F 2 "" H 8250 6650 50  0000 C CNN
F 3 "" H 8250 6650 50  0000 C CNN
	1    8250 6650
	-1   0    0    1   
$EndComp
Text Label 9650 7500 2    60   ~ 0
PD4
Text Label 9650 7600 2    60   ~ 0
PD5
Text Label 9650 7700 2    60   ~ 0
PD6
Text Label 9650 7800 2    60   ~ 0
PD7
Text Label 9650 7900 2    60   ~ 0
PB0
Text Label 9650 8000 2    60   ~ 0
PB1
Text Label 7050 7450 2    60   ~ 0
MUXBG8
Text Label 7050 7350 2    60   ~ 0
MUXBG9
Text Label 7050 7250 2    60   ~ 0
MUXBG10
Text Label 7050 7150 2    60   ~ 0
MUXBG11
Text Label 10850 7200 0    60   ~ 0
VCC
Text Label 10850 7600 0    60   ~ 0
A0
Text Label 10850 7500 0    60   ~ 0
A1
Text Label 10850 7400 0    60   ~ 0
A2
Text Label 10850 7300 0    60   ~ 0
A3
Text Label 9550 8250 0    60   ~ 0
A5
Text Label 9550 8350 0    60   ~ 0
A4
Text Label 9550 8450 0    60   ~ 0
A7
Text Label 9550 8550 0    60   ~ 0
A6
Text Label 10850 8000 0    60   ~ 0
PB2
Text Label 10850 7900 0    60   ~ 0
PB3
Text Label 10850 7800 0    60   ~ 0
PB4
Text Label 10850 7700 0    60   ~ 0
PB5
$Comp
L GNDREF #PWR04
U 1 1 582DDB55
P 9300 7200
F 0 "#PWR04" H 9300 6950 50  0001 C CNN
F 1 "GNDREF" H 9300 7050 50  0000 C CNN
F 2 "" H 9300 7200 50  0000 C CNN
F 3 "" H 9300 7200 50  0000 C CNN
	1    9300 7200
	1    0    0    -1  
$EndComp
Text Label 7050 7050 2    60   ~ 0
MUX12
Text Label 7050 6950 2    60   ~ 0
MUX13
Text Label 7050 6850 2    60   ~ 0
MUX14
Text Label 7050 6750 2    60   ~ 0
MUX15
$Comp
L CONN_01X08 P4
U 1 1 582E0B9A
P 8900 2300
F 0 "P4" H 8900 2750 50  0000 C CNN
F 1 "CONN_01X08" V 9000 2300 50  0000 C CNN
F 2 "SparkFun-Connectors:1X08" H 8900 2300 50  0001 C CNN
F 3 "" H 8900 2300 50  0000 C CNN
	1    8900 2300
	1    0    0    -1  
$EndComp
$Comp
L CONN_01X08 P5
U 1 1 582E0BE8
P 9400 3300
F 0 "P5" H 9400 3750 50  0000 C CNN
F 1 "CONN_01X08" V 9500 3300 50  0000 C CNN
F 2 "SparkFun-Connectors:1X08" H 9400 3300 50  0001 C CNN
F 3 "" H 9400 3300 50  0000 C CNN
	1    9400 3300
	-1   0    0    1   
$EndComp
$Comp
L CONN_01X08 P6
U 1 1 582E0C31
P 10050 3300
F 0 "P6" H 10050 3750 50  0000 C CNN
F 1 "CONN_01X08" V 10150 3300 50  0000 C CNN
F 2 "SparkFun-Connectors:1X08" H 10050 3300 50  0001 C CNN
F 3 "" H 10050 3300 50  0000 C CNN
	1    10050 3300
	1    0    0    -1  
$EndComp
Text Label 7600 1150 2    60   ~ 0
PB0
Text Label 7600 1250 2    60   ~ 0
PB1
Text Label 7600 1350 2    60   ~ 0
PB2
Text Label 7600 1450 2    60   ~ 0
PB3
Text Label 7600 1550 2    60   ~ 0
PB4
Text Label 7600 1650 2    60   ~ 0
PB5
Text Label 8700 1950 2    60   ~ 0
A2
Text Label 8700 2050 2    60   ~ 0
A3
Text Label 8700 2150 2    60   ~ 0
A4
Text Label 8700 2250 2    60   ~ 0
A5
Text Label 8700 2350 2    60   ~ 0
A6
$Comp
L R R1
U 1 1 582E6F9C
P 2200 1000
F 0 "R1" V 2280 1000 50  0000 C CNN
F 1 "R" V 2200 1000 50  0000 C CNN
F 2 "Resistors_ThroughHole:Resistor_Horizontal_RM10mm" V 2130 1000 50  0001 C CNN
F 3 "" H 2200 1000 50  0000 C CNN
	1    2200 1000
	0    1    1    0   
$EndComp
$Comp
L GNDREF #PWR05
U 1 1 582E7055
P 2050 1000
F 0 "#PWR05" H 2050 750 50  0001 C CNN
F 1 "GNDREF" H 2050 850 50  0000 C CNN
F 2 "" H 2050 1000 50  0000 C CNN
F 3 "" H 2050 1000 50  0000 C CNN
	1    2050 1000
	0    1    1    0   
$EndComp
Text Label 5750 8250 1    60   ~ 0
MUXAS0
Text Label 4700 8250 1    60   ~ 0
MUXAS1
Text Label 3650 8250 1    60   ~ 0
MUXAS2
Text Label 2600 8250 1    60   ~ 0
MUXAS3
Text Label 5650 8250 1    60   ~ 0
MUXAB4
Text Label 4600 8250 1    60   ~ 0
MUXAB5
Text Label 3550 8250 1    60   ~ 0
MUXAB6
Text Label 2500 8250 1    60   ~ 0
MUXAB7
Text Label 5550 8250 1    60   ~ 0
MUXAG8
Text Label 4500 8250 1    60   ~ 0
MUXAG9
Text Label 3450 8250 1    60   ~ 0
MUXAG10
Text Label 2400 8250 1    60   ~ 0
MUXAG11
Text Label 2300 8250 1    60   ~ 0
MUXAR15
Text Label 3350 8250 1    60   ~ 0
MUXAR14
Text Label 4400 8250 1    60   ~ 0
MUXAR13
Text Label 5450 8250 1    60   ~ 0
MUXAR12
Text Label 5050 9750 0    60   ~ 0
MUXBS2
Text Label 4950 9900 0    60   ~ 0
MUXBG10
$Comp
L parkFun-BUTTONPAD16-RESCUE-kicad_try_1 PAD-matrix-3
U 1 1 582EB41C
P 2450 10050
F 0 "PAD-matrix-3" H 1950 10650 50  0000 C CNN
F 1 "BP11" H 2350 9700 50  0000 C CNN
F 2 "button-pad-autotel:2x2-buttonpad-sparkfun-autotel" H 2450 10050 50  0001 C CNN
F 3 "" H 2450 10050 50  0000 C CNN
	1    2450 10050
	1    0    0    -1  
$EndComp
Text Label 5750 6150 1    60   ~ 0
MUXAS0
Text Label 4700 6150 1    60   ~ 0
MUXAS1
Text Label 3650 6150 1    60   ~ 0
MUXAS2
Text Label 2600 6150 1    60   ~ 0
MUXAS3
Text Label 5650 6150 1    60   ~ 0
MUXAB4
Text Label 4600 6150 1    60   ~ 0
MUXAB5
Text Label 3550 6150 1    60   ~ 0
MUXAB6
Text Label 2500 6150 1    60   ~ 0
MUXAB7
Text Label 5550 6150 1    60   ~ 0
MUXAG8
Text Label 4500 6150 1    60   ~ 0
MUXAG9
Text Label 3450 6150 1    60   ~ 0
MUXAG10
Text Label 2400 6150 1    60   ~ 0
MUXAG11
Text Label 2300 6150 1    60   ~ 0
MUXAR15
Text Label 3350 6150 1    60   ~ 0
MUXAR14
Text Label 4400 6150 1    60   ~ 0
MUXAR13
Text Label 5450 6150 1    60   ~ 0
MUXAR12
Text Label 5050 7650 0    60   ~ 0
MUXBS1
Text Label 4950 7800 0    60   ~ 0
MUXBG9
$Comp
L parkFun-BUTTONPAD16-RESCUE-kicad_try_1 PAD-matrix-2
U 1 1 582EC1D0
P 4550 5850
F 0 "PAD-matrix-2" H 4050 6450 50  0000 C CNN
F 1 "BP15" H 4450 5500 50  0000 C CNN
F 2 "button-pad-autotel:2x2-buttonpad-sparkfun-autotel" H 4550 5850 50  0001 C CNN
F 3 "" H 4550 5850 50  0000 C CNN
	1    4550 5850
	1    0    0    -1  
$EndComp
Text Label 5750 4050 1    60   ~ 0
MUXAS0
Text Label 4700 4050 1    60   ~ 0
MUXAS1
Text Label 3650 4050 1    60   ~ 0
MUXAS2
Text Label 2600 4050 1    60   ~ 0
MUXAS3
Text Label 5650 4050 1    60   ~ 0
MUXAB4
Text Label 4600 4050 1    60   ~ 0
MUXAB5
Text Label 3550 4050 1    60   ~ 0
MUXAB6
Text Label 2500 4050 1    60   ~ 0
MUXAB7
Text Label 5550 4050 1    60   ~ 0
MUXAG8
Text Label 4500 4050 1    60   ~ 0
MUXAG9
Text Label 3450 4050 1    60   ~ 0
MUXAG10
Text Label 2400 4050 1    60   ~ 0
MUXAG11
Text Label 2300 4050 1    60   ~ 0
MUXAR15
Text Label 3350 4050 1    60   ~ 0
MUXAR14
Text Label 4400 4050 1    60   ~ 0
MUXAR13
Text Label 5450 4050 1    60   ~ 0
MUXAR12
Text Label 5050 5550 0    60   ~ 0
MUXBS0
Text Label 4950 5700 0    60   ~ 0
MUXBG8
$Comp
L D D15
U 1 1 582F60B3
P 4000 11350
F 0 "D15" H 4000 11450 50  0000 C CNN
F 1 "D" H 4000 11250 50  0000 C CNN
F 2 "Diodes_ThroughHole:Diode_DO-41_SOD81_Horizontal_RM10" H 4000 11350 50  0001 C CNN
F 3 "" H 4000 11350 50  0000 C CNN
	1    4000 11350
	0    -1   -1   0   
$EndComp
$Comp
L D D14
U 1 1 582F6140
P 2950 11350
F 0 "D14" H 2950 11450 50  0000 C CNN
F 1 "D" H 2950 11250 50  0000 C CNN
F 2 "Diodes_ThroughHole:Diode_DO-41_SOD81_Horizontal_RM10" H 2950 11350 50  0001 C CNN
F 3 "" H 2950 11350 50  0000 C CNN
	1    2950 11350
	0    -1   -1   0   
$EndComp
$Comp
L D D13
U 1 1 582F65FE
P 1800 11350
F 0 "D13" H 1800 11450 50  0000 C CNN
F 1 "D" H 1800 11250 50  0000 C CNN
F 2 "Diodes_ThroughHole:Diode_DO-41_SOD81_Horizontal_RM10" H 1800 11350 50  0001 C CNN
F 3 "" H 1800 11350 50  0000 C CNN
	1    1800 11350
	0    -1   -1   0   
$EndComp
$Comp
L D D10
U 1 1 582F8563
P 2950 9250
F 0 "D10" H 2950 9350 50  0000 C CNN
F 1 "D" H 2950 9150 50  0000 C CNN
F 2 "Diodes_ThroughHole:Diode_DO-41_SOD81_Horizontal_RM10" H 2950 9250 50  0001 C CNN
F 3 "" H 2950 9250 50  0000 C CNN
	1    2950 9250
	0    -1   -1   0   
$EndComp
$Comp
L D D9
U 1 1 582F85EE
P 1800 9250
F 0 "D9" H 1800 9350 50  0000 C CNN
F 1 "D" H 1800 9150 50  0000 C CNN
F 2 "Diodes_ThroughHole:Diode_DO-41_SOD81_Horizontal_RM10" H 1800 9250 50  0001 C CNN
F 3 "" H 1800 9250 50  0000 C CNN
	1    1800 9250
	0    -1   -1   0   
$EndComp
$Comp
L D D11
U 1 1 582F8683
P 4000 9250
F 0 "D11" H 4000 9350 50  0000 C CNN
F 1 "D" H 4000 9150 50  0000 C CNN
F 2 "Diodes_ThroughHole:Diode_DO-41_SOD81_Horizontal_RM10" H 4000 9250 50  0001 C CNN
F 3 "" H 4000 9250 50  0000 C CNN
	1    4000 9250
	0    -1   -1   0   
$EndComp
$Comp
L D D12
U 1 1 582F8985
P 5050 9250
F 0 "D12" H 5050 9350 50  0000 C CNN
F 1 "D" H 5050 9150 50  0000 C CNN
F 2 "Diodes_ThroughHole:Diode_DO-41_SOD81_Horizontal_RM10" H 5050 9250 50  0001 C CNN
F 3 "" H 5050 9250 50  0000 C CNN
	1    5050 9250
	0    -1   -1   0   
$EndComp
$Comp
L D D5
U 1 1 582FB076
P 1800 7150
F 0 "D5" H 1800 7250 50  0000 C CNN
F 1 "D" H 1800 7050 50  0000 C CNN
F 2 "Diodes_ThroughHole:Diode_DO-41_SOD81_Horizontal_RM10" H 1800 7150 50  0001 C CNN
F 3 "" H 1800 7150 50  0000 C CNN
	1    1800 7150
	0    -1   -1   0   
$EndComp
$Comp
L D D6
U 1 1 582FB10D
P 2950 7150
F 0 "D6" H 2950 7250 50  0000 C CNN
F 1 "D" H 2950 7050 50  0000 C CNN
F 2 "Diodes_ThroughHole:Diode_DO-41_SOD81_Horizontal_RM10" H 2950 7150 50  0001 C CNN
F 3 "" H 2950 7150 50  0000 C CNN
	1    2950 7150
	0    -1   -1   0   
$EndComp
$Comp
L D D7
U 1 1 582FB1BC
P 4000 7150
F 0 "D7" H 4000 7250 50  0000 C CNN
F 1 "D" H 4000 7050 50  0000 C CNN
F 2 "Diodes_ThroughHole:Diode_DO-41_SOD81_Horizontal_RM10" H 4000 7150 50  0001 C CNN
F 3 "" H 4000 7150 50  0000 C CNN
	1    4000 7150
	0    -1   -1   0   
$EndComp
$Comp
L D D8
U 1 1 582FB708
P 5050 7150
F 0 "D8" H 5050 7250 50  0000 C CNN
F 1 "D" H 5050 7050 50  0000 C CNN
F 2 "Diodes_ThroughHole:Diode_DO-41_SOD81_Horizontal_RM10" H 5050 7150 50  0001 C CNN
F 3 "" H 5050 7150 50  0000 C CNN
	1    5050 7150
	0    -1   -1   0   
$EndComp
$Comp
L D D1
U 1 1 582FD83C
P 1800 5050
F 0 "D1" H 1800 5150 50  0000 C CNN
F 1 "D" H 1800 4950 50  0000 C CNN
F 2 "Diodes_ThroughHole:Diode_DO-41_SOD81_Horizontal_RM10" H 1800 5050 50  0001 C CNN
F 3 "" H 1800 5050 50  0000 C CNN
	1    1800 5050
	0    -1   -1   0   
$EndComp
$Comp
L D D2
U 1 1 582FD8F1
P 2950 5050
F 0 "D2" H 2950 5150 50  0000 C CNN
F 1 "D" H 2950 4950 50  0000 C CNN
F 2 "Diodes_ThroughHole:Diode_DO-41_SOD81_Horizontal_RM10" H 2950 5050 50  0001 C CNN
F 3 "" H 2950 5050 50  0000 C CNN
	1    2950 5050
	0    -1   -1   0   
$EndComp
$Comp
L D D3
U 1 1 582FE12B
P 4000 5050
F 0 "D3" H 4000 5150 50  0000 C CNN
F 1 "D" H 4000 4950 50  0000 C CNN
F 2 "Diodes_ThroughHole:Diode_DO-41_SOD81_Horizontal_RM10" H 4000 5050 50  0001 C CNN
F 3 "" H 4000 5050 50  0000 C CNN
	1    4000 5050
	0    -1   -1   0   
$EndComp
$Comp
L D D4
U 1 1 58305FB4
P 5050 5050
F 0 "D4" H 5050 5150 50  0000 C CNN
F 1 "D" H 5050 4950 50  0000 C CNN
F 2 "Diodes_ThroughHole:Diode_DO-41_SOD81_Horizontal_RM10" H 5050 5050 50  0001 C CNN
F 3 "" H 5050 5050 50  0000 C CNN
	1    5050 5050
	0    -1   -1   0   
$EndComp
Text Label 7950 9900 0    60   ~ 0
VCC
$Comp
L CONN_01X08 P2
U 1 1 5831C83C
P 10050 5350
F 0 "P2" H 10050 5800 50  0000 C CNN
F 1 "CONN_01X08" V 10150 5350 50  0000 C CNN
F 2 "SparkFun-Connectors:1X08" H 10050 5350 50  0001 C CNN
F 3 "" H 10050 5350 50  0000 C CNN
	1    10050 5350
	1    0    0    -1  
$EndComp
$Comp
L CONN_01X08 P1
U 1 1 5831CB6E
P 9550 5350
F 0 "P1" H 9550 5800 50  0000 C CNN
F 1 "CONN_01X08" V 9650 5350 50  0000 C CNN
F 2 "SparkFun-Connectors:1X08" H 9550 5350 50  0001 C CNN
F 3 "" H 9550 5350 50  0000 C CNN
	1    9550 5350
	1    0    0    -1  
$EndComp
Text Label 9350 5000 2    60   ~ 0
VCC
$Comp
L GNDREF #PWR06
U 1 1 5831F10C
P 9850 5700
F 0 "#PWR06" H 9850 5450 50  0001 C CNN
F 1 "GNDREF" H 9850 5550 50  0000 C CNN
F 2 "" H 9850 5700 50  0000 C CNN
F 3 "" H 9850 5700 50  0000 C CNN
	1    9850 5700
	1    0    0    -1  
$EndComp
$Comp
L D D16
U 1 1 582F59AA
P 5050 11350
F 0 "D16" H 5050 11450 50  0000 C CNN
F 1 "D" H 5050 11250 50  0000 C CNN
F 2 "Diodes_ThroughHole:Diode_DO-41_SOD81_Horizontal_RM10" H 5050 11350 50  0001 C CNN
F 3 "" H 5050 11350 50  0000 C CNN
	1    5050 11350
	0    -1   -1   0   
$EndComp
$Comp
L parkFun-BUTTONPAD16-RESCUE-kicad_try_1 PAD-matrix-4
U 1 1 582EB09E
P 4550 10050
F 0 "PAD-matrix-4" H 4050 10650 50  0000 C CNN
F 1 "BP7" H 4450 9700 50  0000 C CNN
F 2 "button-pad-autotel:2x2-buttonpad-sparkfun-autotel" H 4550 10050 50  0001 C CNN
F 3 "" H 4550 10050 50  0000 C CNN
	1    4550 10050
	1    0    0    -1  
$EndComp
$Comp
L CONN_01X08 P7
U 1 1 582DFE7C
P 9400 2300
F 0 "P7" H 9400 2750 50  0000 C CNN
F 1 "CONN_01X08" V 9500 2300 50  0000 C CNN
F 2 "SparkFun-Connectors:1X08" H 9400 2300 50  0001 C CNN
F 3 "" H 9400 2300 50  0000 C CNN
	1    9400 2300
	-1   0    0    1   
$EndComp
$Comp
L CONN_01X08 P8
U 1 1 582DFE83
P 10050 2300
F 0 "P8" H 10050 2750 50  0000 C CNN
F 1 "CONN_01X08" V 10150 2300 50  0000 C CNN
F 2 "SparkFun-Connectors:1X08" H 10050 2300 50  0001 C CNN
F 3 "" H 10050 2300 50  0000 C CNN
	1    10050 2300
	1    0    0    -1  
$EndComp
$Comp
L CONN_01X08 P17
U 1 1 582E0290
P 9400 4250
F 0 "P17" H 9400 4700 50  0000 C CNN
F 1 "CONN_01X08" V 9500 4250 50  0000 C CNN
F 2 "SparkFun-Connectors:1X08" H 9400 4250 50  0001 C CNN
F 3 "" H 9400 4250 50  0000 C CNN
	1    9400 4250
	-1   0    0    1   
$EndComp
$Comp
L CONN_01X08 P18
U 1 1 582E0297
P 10050 4250
F 0 "P18" H 10050 4700 50  0000 C CNN
F 1 "CONN_01X08" V 10150 4250 50  0000 C CNN
F 2 "SparkFun-Connectors:1X08" H 10050 4250 50  0001 C CNN
F 3 "" H 10050 4250 50  0000 C CNN
	1    10050 4250
	1    0    0    -1  
$EndComp
$Comp
L CONN_01X08 P11
U 1 1 582E372D
P 8250 3300
F 0 "P11" H 8250 3750 50  0000 C CNN
F 1 "CONN_01X08" V 8350 3300 50  0000 C CNN
F 2 "SparkFun-Connectors:1X08" H 8250 3300 50  0001 C CNN
F 3 "" H 8250 3300 50  0000 C CNN
	1    8250 3300
	-1   0    0    1   
$EndComp
$Comp
L CONN_01X08 P12
U 1 1 582E3734
P 8900 3300
F 0 "P12" H 8900 3750 50  0000 C CNN
F 1 "CONN_01X08" V 9000 3300 50  0000 C CNN
F 2 "SparkFun-Connectors:1X08" H 8900 3300 50  0001 C CNN
F 3 "" H 8900 3300 50  0000 C CNN
	1    8900 3300
	1    0    0    -1  
$EndComp
$Comp
L CONN_01X08 P15
U 1 1 582E3962
P 8250 4250
F 0 "P15" H 8250 4700 50  0000 C CNN
F 1 "CONN_01X08" V 8350 4250 50  0000 C CNN
F 2 "SparkFun-Connectors:1X08" H 8250 4250 50  0001 C CNN
F 3 "" H 8250 4250 50  0000 C CNN
	1    8250 4250
	-1   0    0    1   
$EndComp
$Comp
L CONN_01X08 P16
U 1 1 582E3969
P 8900 4250
F 0 "P16" H 8900 4700 50  0000 C CNN
F 1 "CONN_01X08" V 9000 4250 50  0000 C CNN
F 2 "SparkFun-Connectors:1X08" H 8900 4250 50  0001 C CNN
F 3 "" H 8900 4250 50  0000 C CNN
	1    8900 4250
	1    0    0    -1  
$EndComp
$Comp
L CONN_01X08 P9
U 1 1 582E4C38
P 7150 3300
F 0 "P9" H 7150 3750 50  0000 C CNN
F 1 "CONN_01X08" V 7250 3300 50  0000 C CNN
F 2 "SparkFun-Connectors:1X08" H 7150 3300 50  0001 C CNN
F 3 "" H 7150 3300 50  0000 C CNN
	1    7150 3300
	-1   0    0    1   
$EndComp
$Comp
L CONN_01X08 P10
U 1 1 582E4C3F
P 7800 3300
F 0 "P10" H 7800 3750 50  0000 C CNN
F 1 "CONN_01X08" V 7900 3300 50  0000 C CNN
F 2 "SparkFun-Connectors:1X08" H 7800 3300 50  0001 C CNN
F 3 "" H 7800 3300 50  0000 C CNN
	1    7800 3300
	1    0    0    -1  
$EndComp
$Comp
L CONN_01X08 P13
U 1 1 582E4CD5
P 7150 4250
F 0 "P13" H 7150 4700 50  0000 C CNN
F 1 "CONN_01X08" V 7250 4250 50  0000 C CNN
F 2 "SparkFun-Connectors:1X08" H 7150 4250 50  0001 C CNN
F 3 "" H 7150 4250 50  0000 C CNN
	1    7150 4250
	-1   0    0    1   
$EndComp
$Comp
L CONN_01X08 P14
U 1 1 582E4CDC
P 7800 4250
F 0 "P14" H 7800 4700 50  0000 C CNN
F 1 "CONN_01X08" V 7900 4250 50  0000 C CNN
F 2 "SparkFun-Connectors:1X08" H 7800 4250 50  0001 C CNN
F 3 "" H 7800 4250 50  0000 C CNN
	1    7800 4250
	1    0    0    -1  
$EndComp
$Comp
L GNDREF #PWR07
U 1 1 58303A8B
P 2200 1700
F 0 "#PWR07" H 2200 1450 50  0001 C CNN
F 1 "GNDREF" H 2200 1550 50  0000 C CNN
F 2 "" H 2200 1700 50  0000 C CNN
F 3 "" H 2200 1700 50  0000 C CNN
	1    2200 1700
	0    1    1    0   
$EndComp
$Comp
L GNDREF #PWR08
U 1 1 58304A0F
P 7650 6700
F 0 "#PWR08" H 7650 6450 50  0001 C CNN
F 1 "GNDREF" H 7650 6550 50  0000 C CNN
F 2 "" H 7650 6700 50  0000 C CNN
F 3 "" H 7650 6700 50  0000 C CNN
	1    7650 6700
	-1   0    0    1   
$EndComp
$Comp
L GND #PWR09
U 1 1 5830AAE4
P 9050 7200
F 0 "#PWR09" H 9050 6950 50  0001 C CNN
F 1 "GND" H 9050 7050 50  0000 C CNN
F 2 "" H 9050 7200 50  0000 C CNN
F 3 "" H 9050 7200 50  0000 C CNN
	1    9050 7200
	1    0    0    -1  
$EndComp
$Comp
L CONN_01X16 P19
U 1 1 58329D75
P 7800 1900
F 0 "P19" H 7800 2750 50  0000 C CNN
F 1 "CONN_01X16" V 7900 1900 50  0000 C CNN
F 2 "lcd32-breakout-connector:1X08" H 7800 1900 50  0001 C CNN
F 3 "" H 7800 1900 50  0000 C CNN
	1    7800 1900
	1    0    0    -1  
$EndComp
$Comp
L CONN_01X16 P3
U 1 1 5832AD7E
P 7150 1900
F 0 "P3" H 7150 2750 50  0000 C CNN
F 1 "CONN_01X16" V 7250 1900 50  0000 C CNN
F 2 "lcd32-breakout-connector:1X08" H 7150 1900 50  0001 C CNN
F 3 "" H 7150 1900 50  0000 C CNN
	1    7150 1900
	1    0    0    -1  
$EndComp
Wire Wire Line
	7650 8300 7650 8800
Wire Wire Line
	7650 8800 8300 8800
Wire Wire Line
	3800 1700 4100 1700
Wire Wire Line
	1800 11500 1800 11850
Wire Wire Line
	1900 11100 1700 11100
Wire Wire Line
	1700 11100 1700 12000
Wire Wire Line
	2850 11100 2850 12000
Wire Wire Line
	2950 11500 2950 11850
Wire Wire Line
	3900 11100 3900 12000
Wire Wire Line
	4950 11100 4950 12000
Wire Wire Line
	5050 11850 5050 11500
Wire Wire Line
	8900 6950 8250 6950
Wire Wire Line
	7950 9900 7950 11250
Connection ~ 7950 10650
Connection ~ 7950 10950
Connection ~ 7950 10350
Wire Wire Line
	9750 8550 9550 8550
Wire Wire Line
	9750 8450 9550 8450
Wire Wire Line
	9750 8350 9550 8350
Wire Wire Line
	9750 8250 9550 8250
Wire Wire Line
	9050 7200 9650 7200
Wire Wire Line
	2450 850  2450 1100
Wire Wire Line
	2350 1000 2450 1000
Connection ~ 2450 1000
Wire Wire Line
	1900 9100 1800 9100
Wire Wire Line
	1900 9000 1700 9000
Wire Wire Line
	2950 9000 2850 9000
Wire Wire Line
	2850 9000 2850 9900
Wire Wire Line
	2950 9400 2950 9750
Wire Wire Line
	4000 9000 3900 9000
Wire Wire Line
	3900 9000 3900 9900
Wire Wire Line
	4000 9750 4000 9400
Wire Wire Line
	5050 9000 4950 9000
Wire Wire Line
	4950 9000 4950 9900
Wire Wire Line
	5050 9750 5050 9400
Wire Wire Line
	1900 7000 1800 7000
Wire Wire Line
	1900 6900 1700 6900
Wire Wire Line
	2950 6900 2850 6900
Wire Wire Line
	2850 6900 2850 7800
Wire Wire Line
	2950 7300 2950 7650
Wire Wire Line
	4000 6900 3900 6900
Wire Wire Line
	3900 6900 3900 7800
Wire Wire Line
	4000 7650 4000 7300
Wire Wire Line
	5050 6900 4950 6900
Wire Wire Line
	4950 6900 4950 7800
Wire Wire Line
	5050 7650 5050 7300
Wire Wire Line
	1900 4900 1800 4900
Wire Wire Line
	1900 4800 1700 4800
Wire Wire Line
	2950 4800 2850 4800
Wire Wire Line
	2850 4800 2850 5700
Wire Wire Line
	4000 4800 3900 4800
Wire Wire Line
	5050 4800 4950 4800
Wire Wire Line
	1700 9000 1700 9900
Wire Wire Line
	1800 9400 1800 9750
Wire Wire Line
	1800 7300 1800 7650
Wire Wire Line
	1700 6900 1700 7800
Wire Wire Line
	1800 5200 1800 5550
Wire Wire Line
	1700 4800 1700 5700
Wire Wire Line
	2950 5200 2950 5550
Connection ~ 2950 5550
Connection ~ 4000 5550
Connection ~ 2850 5700
Connection ~ 3900 5700
Wire Wire Line
	1800 7650 5050 7650
Connection ~ 2950 7650
Connection ~ 4000 7650
Wire Wire Line
	1700 7800 4950 7800
Connection ~ 2850 7800
Connection ~ 3900 7800
Wire Wire Line
	1800 9750 5050 9750
Connection ~ 2950 9750
Connection ~ 4000 9750
Wire Wire Line
	1700 9900 4950 9900
Connection ~ 3900 9900
Connection ~ 2850 9900
Wire Wire Line
	1800 11850 5050 11850
Connection ~ 2950 11850
Wire Wire Line
	4950 12000 1700 12000
Connection ~ 2850 12000
Connection ~ 3900 12000
Wire Wire Line
	9600 2950 9850 2950
Wire Wire Line
	9850 3050 9600 3050
Wire Wire Line
	9600 3150 9850 3150
Wire Wire Line
	9850 3250 9600 3250
Wire Wire Line
	9600 3350 9850 3350
Wire Wire Line
	9600 3450 9850 3450
Wire Wire Line
	9600 3550 9850 3550
Wire Wire Line
	9600 3650 9850 3650
Wire Wire Line
	9350 5000 9350 5700
Connection ~ 9350 5500
Connection ~ 9350 5600
Connection ~ 9350 5300
Connection ~ 9350 5400
Connection ~ 9350 5100
Connection ~ 9350 5200
Wire Wire Line
	9850 5000 9850 5700
Connection ~ 9850 5100
Connection ~ 9850 5200
Connection ~ 9850 5300
Connection ~ 9850 5400
Connection ~ 9850 5500
Connection ~ 9850 5600
Wire Wire Line
	4950 4800 4950 5700
Wire Wire Line
	5050 5200 5050 5550
Wire Wire Line
	5050 5550 1800 5550
Wire Wire Line
	4950 5700 1700 5700
Wire Wire Line
	4000 5200 4000 5550
Wire Wire Line
	3900 4800 3900 5700
Wire Wire Line
	4000 11500 4000 11850
Connection ~ 4000 11850
Wire Wire Line
	1800 11200 1900 11200
Wire Wire Line
	2850 11100 2950 11100
Wire Wire Line
	3900 11100 4000 11100
Wire Wire Line
	4950 11100 5050 11100
Wire Wire Line
	9600 1950 9850 1950
Wire Wire Line
	9850 2050 9600 2050
Wire Wire Line
	9600 2150 9850 2150
Wire Wire Line
	9850 2250 9600 2250
Wire Wire Line
	9600 2350 9850 2350
Wire Wire Line
	9600 2450 9850 2450
Wire Wire Line
	9600 2550 9850 2550
Wire Wire Line
	9600 2650 9850 2650
Wire Wire Line
	9600 3900 9850 3900
Wire Wire Line
	9850 4000 9600 4000
Wire Wire Line
	9600 4100 9850 4100
Wire Wire Line
	9850 4200 9600 4200
Wire Wire Line
	9600 4300 9850 4300
Wire Wire Line
	9600 4400 9850 4400
Wire Wire Line
	9600 4500 9850 4500
Wire Wire Line
	9600 4600 9850 4600
Wire Wire Line
	8450 2950 8700 2950
Wire Wire Line
	8700 3050 8450 3050
Wire Wire Line
	8450 3150 8700 3150
Wire Wire Line
	8700 3250 8450 3250
Wire Wire Line
	8450 3350 8700 3350
Wire Wire Line
	8450 3450 8700 3450
Wire Wire Line
	8450 3550 8700 3550
Wire Wire Line
	8450 3650 8700 3650
Wire Wire Line
	8450 3900 8700 3900
Wire Wire Line
	8700 4000 8450 4000
Wire Wire Line
	8450 4100 8700 4100
Wire Wire Line
	8700 4200 8450 4200
Wire Wire Line
	8450 4300 8700 4300
Wire Wire Line
	8450 4400 8700 4400
Wire Wire Line
	8450 4500 8700 4500
Wire Wire Line
	8450 4600 8700 4600
Wire Wire Line
	7350 2950 7600 2950
Wire Wire Line
	7600 3050 7350 3050
Wire Wire Line
	7350 3150 7600 3150
Wire Wire Line
	7600 3250 7350 3250
Wire Wire Line
	7350 3350 7600 3350
Wire Wire Line
	7350 3450 7600 3450
Wire Wire Line
	7350 3550 7600 3550
Wire Wire Line
	7350 3650 7600 3650
Wire Wire Line
	7350 3900 7600 3900
Wire Wire Line
	7600 4000 7350 4000
Wire Wire Line
	7350 4100 7600 4100
Wire Wire Line
	7600 4200 7350 4200
Wire Wire Line
	7350 4300 7600 4300
Connection ~ 9300 7200
Wire Wire Line
	6950 1150 7600 1150
Wire Wire Line
	6950 1250 7600 1250
Wire Wire Line
	6950 1350 7600 1350
Wire Wire Line
	6950 1450 7600 1450
Wire Wire Line
	6950 1550 7600 1550
Wire Wire Line
	6950 1650 7600 1650
Wire Wire Line
	6950 1750 7600 1750
Wire Wire Line
	6950 1850 7600 1850
Wire Wire Line
	6950 1950 7600 1950
Wire Wire Line
	6950 2050 7600 2050
Wire Wire Line
	6950 2150 7600 2150
Wire Wire Line
	6950 2250 7600 2250
Wire Wire Line
	6950 2350 7600 2350
Wire Wire Line
	6950 2450 7600 2450
Wire Wire Line
	6950 2550 7600 2550
Wire Wire Line
	6950 2650 7600 2650
Wire Wire Line
	7350 4400 7600 4400
Wire Wire Line
	7350 4500 7600 4500
Wire Wire Line
	7350 4600 7600 4600
Text Label 7600 4600 2    60   ~ 0
MUX12
Text Label 7600 4500 2    60   ~ 0
MUX13
Text Label 7600 4400 2    60   ~ 0
MUX14
Text Label 7600 4300 2    60   ~ 0
MUX15
$Comp
L BARREL_JACK CON1
U 1 1 58396ED3
P 9750 9100
F 0 "CON1" H 9750 9350 50  0000 C CNN
F 1 "BARREL_JACK" H 9750 8900 50  0000 C CNN
F 2 "Connect:BARREL_JACK" H 9750 9100 50  0001 C CNN
F 3 "" H 9750 9100 50  0000 C CNN
	1    9750 9100
	1    0    0    -1  
$EndComp
$Comp
L GNDREF #PWR011
U 1 1 5839A58F
P 10350 9200
F 0 "#PWR011" H 10350 8950 50  0001 C CNN
F 1 "GNDREF" H 10350 9050 50  0000 C CNN
F 2 "" H 10350 9200 50  0000 C CNN
F 3 "" H 10350 9200 50  0000 C CNN
	1    10350 9200
	0    -1   -1   0   
$EndComp
Wire Wire Line
	10350 9200 10050 9200
Text GLabel 10850 6900 1    60   Input ~ 0
RAWVCC
Text GLabel 10050 9000 2    60   Input ~ 0
RAWVCC
$EndSCHEMATC
