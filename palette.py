#!/Users/aaronbehr/anaconda/bin/python

'''
takes in a list of palettes; outputs a single consolidated palette.
Each palette is a list of 6 hex colors generated from an image.
sometimes it generates fewer than six? so it should be flexible.

don't forget that in order to be able to import from the colour package
you have to install it from the PyPI with "pip install colour"

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
	TODO: remove the ability to pass a list of palettes, we will
	never be using that '''

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
	In our current server/website implementation, k=4 always. 
	So there should not be an option to change it. 

	do a clustering alg like k-means clustering
	maybe rgb would work better than hsl? try it idk


	I think I should have it pick a relatively large number of clusters,
	and then pick the most important ones by the ones which have the
	largest number of colors in them (which you can find out by looking
	in "labels")

	'''

	hsl = []
	rgb = []
	for color in palettes:
		hsl.append((color.hsl))
		rgb.append((color.rgb))


	hsl = np.array(hsl)
	rgb = np.array(rgb)


	# hsl = whiten(hsl) 
	''' prob don't do whiten, it doesn't make sense here
	because it will result in values > 1.
	should try to understand what the purpose of whitening is
	in more depth so that we know its ok not to do it'''




	#centroids, labels = kmeans2(hsl, k)
	centroids, cluster_ids = kmeans2(rgb, k)
	# problem = we're getting negative values...
	# problem = sometimes we get a value greater than one...
	# this problem will not be an issue if we don't use the centroids though.

	''' just pick the centroids '''
	# mean_colors = []
	# for c in centroids:
	# 	mean_colors.append(Color(rgb=tuple(c)).hex)

	# print 'mean_colors',mean_colors


	''' pick a random representative color for each
	of the k clusters. This also works when one or more of the
	clusters is empty. Should probably also handle it such that
	we add white and/or black if there are not enough.'''
	cluster_mappings = [[] for i in range(4)]
	for i in xrange(len(cluster_ids)):
		cluster_mappings[cluster_ids[i]].append(i)

	# print 'cluster_ids',cluster_ids
	# print 'cluster_mappings',cluster_mappings

	random_rep_colors = []
	for cluster in cluster_mappings:
		if len(cluster)>0:
			i = np.random.randint(0,len(cluster))
			random_rep_colors.append(Color(palettes[cluster[i]]).hex)


	# now add white/black if there were empty clusters
	extra = ['white','black','white','black']
	while len(random_rep_colors) < 4:
		random_rep_colors.append(Color(extra.pop(0)).hex)



	# print 'random_colors',random_rep_colors
	# return



	
	# should we try to get at least one color from each image? or what.
	# idk. or should we just put all the colors in a big list and 
	# then go from there.

	# the problem here may be what to do with outliers. like maybe should exclude outliers
	# if they will throw off the means.

	return random_rep_colors







if __name__ == '__main__':

	palettes = convert_colors(str_to_list(sys.argv[1]))

	result = generate_representative_colors(palettes)

	print list_to_str(result)







	