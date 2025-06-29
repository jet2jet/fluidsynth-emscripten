# FluidSynth - A Software Synthesize
#
# Copyright (C) 2003-2010 Peter Hanappe and others.
#
# This library is free software; you can redistribute it and/or
# modify it under the terms of the GNU Lesser General Public License
# as published by the Free Software Foundation; either version 2.1 of
# the License, or (at your option) any later version.
#
# This library is distributed in the hope that it will be useful, but
# WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
# Lesser General Public License for more details.
#
# You should have received a copy of the GNU Lesser General Public
# License along with this library; if not, write to the Free
# Foundation, Inc., 59 Temple Place, Suite 330, Boston, MA
# 02111-1307, USA

# CMake based build system. Pedro Lopez-Cabanillas <plcl@users.sf.net>

unset ( BUILD_DEMOS )
if ( NOT EMSCRIPTEN_SUPPORT )
  set ( BUILD_DEMOS on )
elseif ( NOT BUILD_SHARED_LIBS )
  set ( BUILD_DEMOS on )
else ( NOT EMSCRIPTEN_SUPPORT )
  set ( BUILD_DEMOS off )
endif ( NOT EMSCRIPTEN_SUPPORT )

if ( BUILD_DEMOS )
  include ( FluidUnitTest )
  add_custom_target ( demo )

  ADD_FLUID_DEMO ( example )
  ADD_FLUID_DEMO ( fluidsynth_arpeggio )
  ADD_FLUID_DEMO ( fluidsynth_fx )
  ADD_FLUID_DEMO ( fluidsynth_metronome )
  ADD_FLUID_DEMO ( fluidsynth_simple )
  ADD_FLUID_DEMO ( fluidsynth_instruments )
  ADD_FLUID_DEMO ( fluidsynth_enumsettings CXX )
endif ( BUILD_DEMOS )
