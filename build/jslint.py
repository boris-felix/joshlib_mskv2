#!/usr/bin/env python
# encoding: utf-8
"""
jslint.py

Created by Sylvain Zimmer on 2011-02-10.
Copyright (c) 2011 __MyCompanyName__. All rights reserved.
"""

import sys
import os


def main():
	for root, dirs, files in os.walk("js/josh/"):
	    for f in files:
	        p = os.path.join(root,f)
	        print
	        print "-"*40
	        print p
	        print
	        os.system("jslint %s" % p)


if __name__ == '__main__':
	main()

