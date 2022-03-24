module Main where

import Library

import Test.Hspec.Core.Runner
import Test.Hspec.Core.Spec
import Test.Hspec.Expectations

main :: IO ()
main = hspecWith defaultConfig $ do
  it "42 is undefined" (fortyTwo == undefined)
  it "42 is 43" (fortyTwo == 43)
  it "has no reason?" False
  describe "because" $ do
    it "has a reason?" False
    it "really has a reason" (fortyTwo `shouldBe` 43)
  describe "products" $ do
    it "does not equal" (Product fortyTwo True `shouldBe` Product fortyTwo False)
  describe "sums" $ do
    it "does not equal" (VariantA fortyTwo `shouldBe` VariantB True)
