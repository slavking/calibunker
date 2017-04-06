#!/bin/bash
#
# Script to read the TOR exit nodes and store them in a file
#
#

IP_ADDRESS=$(/sbin/ifconfig eth0 | awk '/inet addr/ {split ($2,A,":"); print A[2]}')
LB_DIR=
LB_TMP_DIR=$LB_DIR/tmp

wget -q -O - "https://check.torproject.org/cgi-bin/TorBulkExitList.py?ip=$IP_ADDRESS&port=80" -U NoSuchBrowser/1.0 > $LB_TMP_DIR/tor_nodes.tmp
wget -q -O - "https://check.torproject.org/cgi-bin/TorBulkExitList.py?ip=$IP_ADDRESS&port=443" -U NoSuchBrowser/1.0 >> $LB_TMP_DIR/tor_nodes.tmp
cat $LB_TMP_DIR/tor_nodes.tmp | sort | uniq > $LB_TMP_DIR/tor_nodes

node $LB_DIR/lib/tor-update.js
