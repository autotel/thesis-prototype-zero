EESchema Schematic File Version 2
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
LIBS:Sparkfun-silicon-buttons-pad
LIBS:buttonpadtest-cache
EELAYER 25 0
EELAYER END
$Descr A4 11693 8268
encoding utf-8
Sheet 1 1
Title ""
Date ""
Rev ""
Comp ""
Comment1 ""
Comment2 ""
Comment3 ""
Comment4 ""
$EndDescr
$Comp
L testpad TP1
U 1 1 582B7627
P 4050 2850
F 0 "TP1" V 4300 2950 60  0000 C CNN
F 1 "testpad" H 4050 2850 60  0000 C CNN
F 2 "buttonpadtest:BUTTONPAD-2X2" H 4050 2850 60  0001 C CNN
F 3 "" H 4050 2850 60  0001 C CNN
	1    4050 2850
	1    0    0    -1  
$EndComp
$Comp
L Battery BT1
U 1 1 582B781F
P 3150 2300
F 0 "BT1" H 3250 2350 50  0000 L CNN
F 1 "Battery" H 3250 2250 50  0000 L CNN
F 2 "SparkFun-Electromechanical:BATTCON_9V" V 3150 2340 50  0000 C CNN
F 3 "" V 3150 2340 50  0000 C CNN
	1    3150 2300
	1    0    0    -1  
$EndComp
Wire Wire Line
	3150 2150 3850 2150
Wire Wire Line
	3850 2150 3850 2400
Wire Wire Line
	3850 2350 4200 2350
Wire Wire Line
	3900 2350 4100 2350
Connection ~ 4000 2350
Connection ~ 4100 2350
Connection ~ 3900 2350
Wire Wire Line
	3150 2450 3150 2950
Wire Wire Line
	3150 2950 3650 2950
Wire Wire Line
	3650 2850 3150 2850
Connection ~ 3150 2850
$Comp
L R R1
U 1 1 582C43BB
P 3650 2550
F 0 "R1" V 3730 2550 50  0000 C CNN
F 1 "R" V 3650 2550 50  0000 C CNN
F 2 "Resistors_SMD:R_2512_HandSoldering" V 3580 2550 50  0000 C CNN
F 3 "" H 3650 2550 50  0000 C CNN
	1    3650 2550
	1    0    0    -1  
$EndComp
Wire Wire Line
	3850 2400 3650 2400
Connection ~ 3850 2350
Wire Wire Line
	3650 2700 3500 2700
Wire Wire Line
	3500 2700 3500 2850
Connection ~ 3500 2850
$EndSCHEMATC
