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
$Descr A4 11693 8268
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
P 2450 7050
F 0 "SW1" H 2600 7160 50  0000 C CNN
F 1 "SW_PUSH" H 2450 6970 50  0000 C CNN
F 2 "Buttons_Switches_ThroughHole:SW_PUSH_6mm" H 2450 7050 50  0001 C CNN
F 3 "" H 2450 7050 50  0000 C CNN
	1    2450 7050
	0    1    1    0   
$EndComp
$Comp
L SW_PUSH SW3
U 1 1 582B9BF5
P 2750 7050
F 0 "SW3" H 2900 7160 50  0000 C CNN
F 1 "SW_PUSH" H 2750 6970 50  0000 C CNN
F 2 "Buttons_Switches_ThroughHole:SW_PUSH_6mm" H 2750 7050 50  0001 C CNN
F 3 "" H 2750 7050 50  0000 C CNN
	1    2750 7050
	0    1    1    0   
$EndComp
$Comp
L SW_PUSH SW4
U 1 1 582B9CDF
P 3050 7050
F 0 "SW4" H 3200 7160 50  0000 C CNN
F 1 "SW_PUSH" H 3050 6970 50  0000 C CNN
F 2 "Buttons_Switches_ThroughHole:SW_PUSH_6mm" H 3050 7050 50  0001 C CNN
F 3 "" H 3050 7050 50  0000 C CNN
	1    3050 7050
	0    1    1    0   
$EndComp
$Comp
L SW_PUSH SW5
U 1 1 582B9DCC
P 3350 7050
F 0 "SW5" H 3500 7160 50  0000 C CNN
F 1 "SW_PUSH" H 3350 6970 50  0000 C CNN
F 2 "Buttons_Switches_ThroughHole:SW_PUSH_6mm" H 3350 7050 50  0001 C CNN
F 3 "" H 3350 7050 50  0000 C CNN
	1    3350 7050
	0    1    1    0   
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
P 7450 4500
F 0 "U3" H 7700 5350 50  0000 C CNN
F 1 "CD74HCT4067" H 7750 3600 50  0000 C CNN
F 2 "SparkFun-DigitalIC:TSSOP-24" H 7450 4500 60  0001 C CNN
F 3 "" H 7450 4500 60  0001 C CNN
	1    7450 4500
	-1   0    0    1   
$EndComp
Text Label 8100 5800 0    60   ~ 0
VCC
$Comp
L GNDREF #PWR01
U 1 1 582C244B
P 8050 4850
F 0 "#PWR01" H 8050 4600 50  0001 C CNN
F 1 "GNDREF" H 8050 4700 50  0000 C CNN
F 2 "" H 8050 4850 50  0000 C CNN
F 3 "" H 8050 4850 50  0000 C CNN
	1    8050 4850
	1    0    0    -1  
$EndComp
Text Label 8050 3950 0    60   ~ 0
A0
Text Label 8050 4350 0    60   ~ 0
PD7
Text Label 8050 4450 0    60   ~ 0
PD6
Text Label 8050 4550 0    60   ~ 0
PD5
Text Label 8050 4650 0    60   ~ 0
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
Text Label 6850 2100 2    60   ~ 0
PD0
Text Label 6850 2000 2    60   ~ 0
PD1
Text Label 6850 2200 2    60   ~ 0
PD2
Text Label 6850 2300 2    60   ~ 0
PD3
$Comp
L ARDUPROMINI-6 uP1
U 1 1 582D5713
P 8050 900
F 0 "uP1" H 7850 800 60  0000 C CNN
F 1 "ARDUPROMINI-6" H 8050 900 60  0000 C CNN
F 2 "ArduProMiniTKB:ArduProMini-6" H 8050 900 60  0001 C CNN
F 3 "" H 8050 900 60  0000 C CNN
	1    8050 900 
	1    0    0    -1  
$EndComp
$Comp
L parkFun-BUTTONPAD16-RESCUE-kicad_try_1 PAD-matrix-1
U 1 1 582DAE3C
P 1950 4000
F 0 "PAD-matrix-1" H 1450 4600 50  0000 C CNN
F 1 "parkFun-BUTTONPAD16" H 1850 3650 50  0000 C CNN
F 2 "button-pad-autotel:2x2-buttonpad-sparkfun-autotel" H 1950 4000 50  0001 C CNN
F 3 "" H 1950 4000 50  0000 C CNN
	1    1950 4000
	1    0    0    -1  
$EndComp
$Comp
L parkFun-BUTTONPAD16-RESCUE-kicad_try_1 PAD-matrix-?
U 1 1 582C73FD
P 3000 4000
F 0 "PAD-matrix-?" H 2500 4600 50  0000 C CNN
F 1 "parkFun-BUTTONPAD16" H 3000 3650 50  0000 C CNN
F 2 "button-pad-autotel:2x2-buttonpad-sparkfun-autotel" H 3000 4000 50  0001 C CNN
F 3 "" H 3000 4000 50  0000 C CNN
	1    3000 4000
	1    0    0    -1  
$EndComp
$Comp
L parkFun-BUTTONPAD16-RESCUE-kicad_try_1 PAD-matrix-?
U 1 1 582C74E6
P 4050 4000
F 0 "PAD-matrix-?" H 3550 4600 50  0000 C CNN
F 1 "parkFun-BUTTONPAD16" H 4050 3650 50  0000 C CNN
F 2 "button-pad-autotel:2x2-buttonpad-sparkfun-autotel" H 4050 4000 50  0001 C CNN
F 3 "" H 4050 4000 50  0000 C CNN
	1    4050 4000
	1    0    0    -1  
$EndComp
$Comp
L parkFun-BUTTONPAD16-RESCUE-kicad_try_1 PAD-matrix-?
U 1 1 582C80C8
P 5100 4000
F 0 "PAD-matrix-?" H 4600 4600 50  0000 C CNN
F 1 "parkFun-BUTTONPAD16" H 5100 3650 50  0000 C CNN
F 2 "button-pad-autotel:2x2-buttonpad-sparkfun-autotel" H 5100 4000 50  0001 C CNN
F 3 "" H 5100 4000 50  0000 C CNN
	1    5100 4000
	1    0    0    -1  
$EndComp
Text Label 2450 1100 1    60   ~ 0
A1
Wire Wire Line
	7450 5300 7450 5800
Wire Wire Line
	7450 5800 8100 5800
Wire Wire Line
	3800 1700 4100 1700
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
MUXAR12
Text Label 2350 2300 3    60   ~ 0
MUXAR12
Text Label 2250 2300 3    60   ~ 0
MUXAR12
$EndSCHEMATC
