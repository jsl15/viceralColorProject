#!/Users/aaronbehr/anaconda/bin/python


'''
takes in a list of palettes; outputs a single consolidated palette.
Each palette is a list of 6 hex colors generated from an image.
sometimes it generates fewer than six? so it should be flexible.

Don't forget that in order to be able to import from the colour package
you have to install it from PyPI with `pip install colour`

Also, make sure that this file is executable (i.e. call `chmod +x palette.py`).
This allows the Node child_process.exec() in the server to call this script.
'''

from colour import Color
import sys
from scipy.cluster.vq import whiten, kmeans2
import numpy as np


def str_to_list(s):
	''' parses the input to a python list. also adds hashtags
	to hex values, which are not given in the input'''

	if s[0] == '[':
		s = s[1:-1] # remove brackets @ beginning and end
	
	colors = s.split(',')

	for i in range(len(colors)):
		colors[i] = '#'+colors[i]

	return colors



def list_to_str(l):
	'''converts python list to a string that javascript
	can easily convert to an array'''
	s = ''

	for x in l:
		s += x
		s += ','

	return s[:-1] # remove the extra comma at the end



def convert_colors(palette):
	'''converts from a hex string to the color object
	so we can ask it about its hue and such.
	you can pass in a palette (list of colors) or a list of palettes.
	Our current implementation never passes a list of per-image palettes.
	'''

	hsv_palette = []

	if type(palette[0]) is list:
		for x in palette:
			subpalette = []
			for c in x:
				subpalette.append(Color(c))
			hsv_palette.append(subpalette)
	else:
		for c in palette:
			hsv_palette.append(Color(c))

	return hsv_palette



def generate_representative_colors(palettes, k=4):
	''' 
	In our current implementation, k==4, so there is
	no option to change it.  

	Perform k-means clustering on the data, and then pick
	a random representative color from each cluster. Through
	experimentation, we have seen that choosing a random
	representative color per cluster works better than choosing
	the mean of each cluster.

	Note that the whitening step (common to perform before k-means
	clustering) is ommitted in this implementation because it would
	mess up the scaling of the RGB values.


	This function always returns four colors. In cases where very 
	few colors have been inputted, the kmeans algorithm cannot
	generate four distinct clusters. In these cases, white and 
	black are chosen arbitrarily to supplement the palette.

	This function calculates a good deal of extra data that
	is not returned, such that one can easily manipulate what
	gets returned and experiment with different techniques.
	'''

	hsl = []
	rgb = []
	for color in palettes:
		hsl.append((color.hsl))
		rgb.append((color.rgb))


	hsl = np.array(hsl)
	rgb = np.array(rgb)

	#rgb = whiten(rgb)

	centroids, cluster_ids = kmeans2(rgb, k)
	
	''' pick the centroids '''
	# mean_colors = []
	# for c in centroids:
	# 	mean_colors.append(Color(rgb=tuple(c)).hex)
	# print 'mean_colors',mean_colors


	''' pick a random representative color for each cluster '''
	cluster_mappings = [[] for i in range(4)]
	for i in xrange(len(cluster_ids)):
		cluster_mappings[cluster_ids[i]].append(i)

	random_rep_colors = []
	for cluster in cluster_mappings:
		if len(cluster)>0:
			i = np.random.randint(0,len(cluster))
			random_rep_colors.append(Color(palettes[cluster[i]]).hex)


	# now add white/black if there were empty clusters
	extra = ['white','black','white','black']
	while len(random_rep_colors) < 4:
		random_rep_colors.append(Color(extra.pop(0)).hex)


	return random_rep_colors





if __name__ == '__main__':

	# Convert javascript input string to python list
	palettes = convert_colors(str_to_list(sys.argv[1]))

	# run clustering algorithm to generate palette
	result = generate_representative_colors(palettes)

	# return result to the server
	print list_to_str(result)







	
